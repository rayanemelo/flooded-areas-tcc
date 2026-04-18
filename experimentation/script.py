from __future__ import annotations

import argparse
import base64
import csv
import io
import json
import mimetypes
import os
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Optional, Sequence
from urllib import error, request

try:
    from PIL import Image
except ImportError:  # pragma: no cover - depende do ambiente local
    Image = None


SUPPORTED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".gif",
    ".tif",
    ".tiff",
}

DEFAULT_BASE_URL = "http://localhost:1234/v1"
DEFAULT_IMAGE_DIR = Path(__file__).resolve().parent / "images"
DEFAULT_OUTPUT_CSV = Path(__file__).resolve().parent / "outputs" / "flood_detection_results.csv"
DEFAULT_MODELS_FILE = Path(__file__).resolve().parent / "models.json"
DEFAULT_PROMPTS_FILE = Path(__file__).resolve().parent / "prompts.json"
SYSTEM_PROMPT = """
You are a vision model evaluating whether an image contains flooding.
Return only valid JSON with these keys:
- "flood_detected": boolean
- "flood_level": "none|leve|moderado|interditado"
- "fraud_suspected": boolean
- "reason": short string
Do not add markdown, explanations, extra keys, or commentary.
""".strip()

FLOOD_LEVEL_VALUES = {"none", "leve", "moderado", "interditado"}
INLINE_SAFE_IMAGE_MIME_TYPES = {"image/png", "image/jpeg", "image/gif"}


@dataclass(frozen=True)
class PromptSpec:
    prompt_id: str
    user_prompt: str
    system_prompt: Optional[str] = None


@dataclass(frozen=True)
class EncodedImage:
    image_name: str
    image_path: Path
    mime_type: str
    base64_data: str
    max_side: Optional[int] = None


@dataclass(frozen=True)
class ModelResponse:
    flood_detected: bool
    flood_level: str
    fraud_suspected: bool
    reason: str


@dataclass(frozen=True)
class ExperimentResult:
    image_name: str
    model: str
    prompt_id: str
    flood_detected: Optional[bool]
    flood_level: Optional[str]
    fraud_suspected: Optional[bool]
    reason: Optional[str]
    error: Optional[str] = None


def log(message: str) -> None:
    print(f"[experiment] {message}", flush=True)


def format_duration(seconds: float) -> str:
    total_milliseconds = int(round(seconds * 1000))
    minutes, milliseconds_remaining = divmod(total_milliseconds, 60_000)
    seconds_part, milliseconds = divmod(milliseconds_remaining, 1000)
    return f"{minutes:02d}:{seconds_part:02d}.{milliseconds:03d}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Executa o experimento de deteccao de alagamentos via LM Studio."
    )
    parser.add_argument(
        "--images-dir",
        type=Path,
        default=DEFAULT_IMAGE_DIR,
        help=f"Diretorio contendo as imagens. Padrao: {DEFAULT_IMAGE_DIR}",
    )
    parser.add_argument(
        "--output-csv",
        type=Path,
        default=DEFAULT_OUTPUT_CSV,
        help=f"Arquivo CSV de saida. Padrao: {DEFAULT_OUTPUT_CSV}",
    )
    parser.add_argument(
        "--base-url",
        default=DEFAULT_BASE_URL,
        help=f"Base URL da API do LM Studio. Padrao: {DEFAULT_BASE_URL}",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=120,
        help="Timeout em segundos para cada chamada ao modelo.",
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=400,
        help="Limite de tokens gerados por resposta.",
    )
    parser.add_argument(
        "--max-image-side",
        type=int,
        default=768,
        help=(
            "Maior lado da imagem enviada ao modelo, em pixels. "
            "Use 0 para enviar no tamanho original. Padrao: 768."
        ),
    )
    parser.add_argument(
        "--context-retry-image-sides",
        default="512,384",
        help=(
            "Tamanhos menores para tentar automaticamente quando o contexto estourar. "
            "Use lista separada por virgulas ou vazio para desativar. Padrao: 512,384."
        ),
    )
    parser.add_argument(
        "--unload-model-between-models",
        action=argparse.BooleanOptionalAction,
        default=True,
        help=(
            "Descarrega o modelo no LM Studio ao finalizar todos os testes dele, "
            "antes de passar para o proximo modelo. "
            "Use --no-unload-model-between-models para desativar."
        ),
    )
    return parser.parse_args()


def load_images(directory: Path) -> list[Path]:
    if not directory.exists():
        raise FileNotFoundError(f"Diretorio de imagens nao encontrado: {directory}")

    image_paths = [
        path
        for path in directory.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_IMAGE_EXTENSIONS
    ]
    return sorted(image_paths)


def parse_retry_image_sides(raw_value: str) -> list[int]:
    if not raw_value.strip():
        return []

    retry_sides: list[int] = []
    for raw_item in raw_value.split(","):
        item = raw_item.strip()
        if not item:
            continue
        try:
            side = int(item)
        except ValueError as exc:
            raise ValueError(
                f"Tamanho invalido em --context-retry-image-sides: {item}"
            ) from exc
        if side <= 0:
            raise ValueError(
                "--context-retry-image-sides deve conter apenas inteiros positivos."
            )
        retry_sides.append(side)

    return retry_sides


def load_models(models_file: Path = DEFAULT_MODELS_FILE) -> list[str]:
    if not models_file.exists():
        raise FileNotFoundError(f"Arquivo de modelos nao encontrado: {models_file}")

    payload = json.loads(models_file.read_text(encoding="utf-8"))
    entries = payload.get("models") if isinstance(payload, dict) else payload

    if not isinstance(entries, list) or not entries:
        raise ValueError("O arquivo de modelos deve conter uma lista nao vazia.")

    models: list[str] = []
    for index, entry in enumerate(entries, start=1):
        if not isinstance(entry, str):
            raise ValueError(f"Modelo invalido na posicao {index}.")
        model_name = entry.strip()
        if not model_name:
            raise ValueError(f"Modelo vazio na posicao {index}.")
        models.append(model_name)

    return models


def list_available_models(base_url: str, timeout: int) -> list[str]:
    endpoint = f"{base_url.rstrip('/')}/models"
    http_request = request.Request(
        endpoint,
        headers={"Accept": "application/json"},
        method="GET",
    )

    try:
        with request.urlopen(http_request, timeout=timeout) as response:
            raw_response = response.read().decode("utf-8")
    except error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code} ao listar modelos: {error_body}") from exc
    except error.URLError as exc:
        raise RuntimeError(
            f"Falha de conexao com o LM Studio em {base_url}: {exc.reason}"
        ) from exc

    payload = json.loads(raw_response)
    data = payload.get("data")
    if not isinstance(data, list):
        raise ValueError("Resposta inesperada ao listar modelos no LM Studio.")

    model_ids = []
    for item in data:
        if isinstance(item, dict):
            model_id = item.get("id")
            if isinstance(model_id, str) and model_id.strip():
                model_ids.append(model_id.strip())

    if not model_ids:
        raise ValueError("Nenhum modelo encontrado no endpoint /v1/models.")

    return model_ids


def resolve_models(
    requested_models: Sequence[str],
    available_models: Sequence[str],
) -> list[str]:
    resolved_models: list[str] = []
    for model in requested_models:
        resolved_models.append(resolve_model_name(model, available_models))
    return resolved_models


def resolve_model_name(requested_model: str, available_models: Sequence[str]) -> str:
    requested = requested_model.strip()
    if not requested:
        raise ValueError("Nome de modelo vazio nao e permitido.")

    if requested in available_models:
        return requested

    requested_core = normalize_model_name(requested)
    exact_core_matches = [
        model for model in available_models if normalize_model_name(model) == requested_core
    ]
    if len(exact_core_matches) == 1:
        return exact_core_matches[0]
    if len(exact_core_matches) > 1:
        raise ValueError(
            f"Modelo '{requested}' e ambiguo. Correspondencias: {', '.join(exact_core_matches)}"
        )

    partial_matches = [
        model
        for model in available_models
        if requested_core in normalize_model_name(model)
        or normalize_model_name(model) in requested_core
    ]
    if len(partial_matches) == 1:
        return partial_matches[0]
    if len(partial_matches) > 1:
        raise ValueError(
            f"Modelo '{requested}' e ambiguo. Correspondencias: {', '.join(partial_matches)}"
        )

    available = ", ".join(available_models)
    raise ValueError(
        f"Modelo '{requested}' nao encontrado no LM Studio. Modelos disponiveis: {available}"
    )


def normalize_model_name(model_name: str) -> str:
    normalized = model_name.strip().lower()
    if "/" in normalized:
        normalized = normalized.rsplit("/", maxsplit=1)[-1]
    return normalized


def load_prompts(prompts_file: Path = DEFAULT_PROMPTS_FILE) -> list[PromptSpec]:
    if not prompts_file.exists():
        raise FileNotFoundError(f"Arquivo de prompts nao encontrado: {prompts_file}")

    if prompts_file.suffix.lower() != ".json":
        raise ValueError("O arquivo de prompts deve ser um .json.")

    payload = json.loads(prompts_file.read_text(encoding="utf-8"))
    entries = payload.get("prompts") if isinstance(payload, dict) else payload

    if not isinstance(entries, list) or not entries:
        raise ValueError("O arquivo JSON de prompts deve conter uma lista nao vazia.")

    prompts: list[PromptSpec] = []
    for index, entry in enumerate(entries, start=1):
        if isinstance(entry, str):
            text = entry.strip()
            if not text:
                raise ValueError(f"Prompt vazio encontrado na posicao {index}.")
            prompts.append(PromptSpec(prompt_id=f"prompt_{index}", user_prompt=text))
            continue

        if not isinstance(entry, dict):
            raise ValueError(f"Formato invalido para prompt na posicao {index}.")

        prompt_id = str(entry.get("id") or f"prompt_{index}").strip()
        user_prompt = str(entry.get("user_prompt") or entry.get("text") or "").strip()
        system_prompt_raw = entry.get("system_prompt")
        system_prompt = (
            str(system_prompt_raw).strip() if system_prompt_raw is not None else None
        )
        if system_prompt == "":
            system_prompt = None
        if not prompt_id or not user_prompt:
            raise ValueError(
                f"Prompt invalido na posicao {index}: id/user_prompt obrigatorios."
            )
        prompts.append(
            PromptSpec(
                prompt_id=prompt_id,
                user_prompt=user_prompt,
                system_prompt=system_prompt,
            )
        )

    _validate_prompt_ids(prompts)
    return prompts


def _validate_prompt_ids(prompts: Sequence[PromptSpec]) -> None:
    seen_ids: set[str] = set()
    for prompt in prompts:
        if prompt.prompt_id in seen_ids:
            raise ValueError(f"Prompt ID duplicado encontrado: {prompt.prompt_id}")
        seen_ids.add(prompt.prompt_id)


def encode_image_to_base64(image_path: Path, max_image_side: Optional[int] = None) -> EncodedImage:
    mime_type = mimetypes.guess_type(image_path.name)[0] or "application/octet-stream"
    image_bytes = image_path.read_bytes()

    if max_image_side is not None:
        image_bytes, mime_type = resize_image(image_bytes, max_image_side)
    elif mime_type not in INLINE_SAFE_IMAGE_MIME_TYPES:
        image_bytes, mime_type = convert_image_to_png(image_bytes)

    encoded = base64.b64encode(image_bytes).decode("ascii")
    return EncodedImage(
        image_name=image_path.name,
        image_path=image_path.resolve(),
        mime_type=mime_type,
        base64_data=encoded,
        max_side=max_image_side,
    )


def build_image_variants(
    image_path: Path,
    max_image_side: int,
    retry_image_sides: Sequence[int],
) -> list[EncodedImage]:
    requested_sides: list[Optional[int]]
    if max_image_side > 0:
        requested_sides = [max_image_side, *retry_image_sides]
    else:
        requested_sides = [None, *retry_image_sides]

    variants: list[EncodedImage] = []
    seen_sides: set[Optional[int]] = set()
    for side in requested_sides:
        if side in seen_sides:
            continue
        seen_sides.add(side)
        variants.append(encode_image_to_base64(image_path, side))

    return variants


def resize_image(image_bytes: bytes, max_image_side: int) -> tuple[bytes, str]:
    if Image is None:
        raise RuntimeError(
            "Pillow nao esta instalado. Instale-o para redimensionar imagens antes do envio."
        )

    with Image.open(io.BytesIO(image_bytes)) as image:
        image.load()
        resampling_filter = getattr(Image, "Resampling", Image).LANCZOS
        image.thumbnail((max_image_side, max_image_side), resampling_filter)

        if image.mode in ("RGBA", "LA") or (
            image.mode == "P" and "transparency" in image.info
        ):
            background = Image.new("RGB", image.size, (255, 255, 255))
            background.paste(image.convert("RGBA"), mask=image.convert("RGBA").split()[-1])
            image = background
        elif image.mode != "RGB":
            image = image.convert("RGB")

        output = io.BytesIO()
        image.save(output, format="JPEG", quality=85, optimize=True)
    return output.getvalue(), "image/jpeg"


def convert_image_to_png(image_bytes: bytes) -> tuple[bytes, str]:
    if Image is None:
        raise RuntimeError(
            "Pillow nao esta instalado. Instale-o para converter imagens para PNG antes do envio."
        )
    with Image.open(io.BytesIO(image_bytes)) as image:
        output = io.BytesIO()
        image.save(output, format="PNG")
    return output.getvalue(), "image/png"


def call_model(
    base_url: str,
    model: str,
    prompt: PromptSpec,
    image_variants: Sequence[EncodedImage],
    timeout: int = 120,
    max_tokens: int = 400,
) -> str:
    endpoint = f"{base_url.rstrip('/')}/chat/completions"
    system_instruction = prompt.system_prompt or SYSTEM_PROMPT

    last_error: Optional[Exception] = None
    for image_index, image in enumerate(image_variants):
        image_data_url = f"data:{image.mime_type};base64,{image.base64_data}"
        content_variants = [
            [
                {"type": "text", "text": prompt.user_prompt},
                {"type": "image_url", "image_url": {"url": image_data_url}},
            ],
            [
                {"type": "text", "text": prompt.user_prompt},
                {"type": "image_url", "image_url": image_data_url},
            ],
            [
                {"type": "text", "text": prompt.user_prompt},
                {"type": "image_url", "image_url": {"url": image.base64_data}},
            ],
        ]

        try_next_image_size = False
        for content in content_variants:
            current_max_tokens = max_tokens
            while True:
                payload = {
                    "model": model,
                    "temperature": 0,
                    "max_tokens": current_max_tokens,
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": content},
                    ],
                }

                try:
                    raw_response = post_chat_completion(endpoint, payload, timeout)
                    response_payload = json.loads(raw_response)
                    return extract_assistant_content(response_payload)
                except RuntimeError as exc:
                    last_error = exc
                    overflow_adjustment = suggest_smaller_max_tokens(
                        exc, current_max_tokens
                    )
                    if (
                        overflow_adjustment is not None
                        and overflow_adjustment < current_max_tokens
                    ):
                        log(
                            f"Contexto excedido para modelo {model}; reduzindo "
                            f"max_tokens de {current_max_tokens} para "
                            f"{overflow_adjustment} e tentando novamente"
                        )
                        current_max_tokens = overflow_adjustment
                        continue

                    if is_context_size_error(exc):
                        next_image = image_variants[image_index + 1] if (
                            image_index + 1 < len(image_variants)
                        ) else None
                        if next_image is not None:
                            log(
                                f"Contexto ainda excedido para modelo {model}; "
                                f"tentando imagem menor "
                                f"({format_image_variant(next_image)})"
                            )
                            try_next_image_size = True
                            break

                    if "base64 encoded image" not in str(exc).lower():
                        raise RuntimeError(
                            f"HTTP ao chamar o modelo '{model}': {exc}"
                        ) from exc
                    break

            if try_next_image_size:
                break

    assert last_error is not None
    raise RuntimeError(f"HTTP ao chamar o modelo '{model}': {last_error}") from last_error


def format_image_variant(image: EncodedImage) -> str:
    if image.max_side is None:
        return "original"
    return f"max_side={image.max_side}px"


def is_context_size_error(exc: Exception) -> bool:
    return re.search(
        r"request \(\d+ tokens\) exceeds the available context size \(\d+ tokens\)",
        str(exc),
        flags=re.IGNORECASE,
    ) is not None


def native_api_base_url(base_url: str) -> str:
    normalized = base_url.rstrip("/")
    if normalized.endswith("/v1"):
        return normalized[: -len("/v1")] + "/api/v1"
    if normalized.endswith("/api/v1"):
        return normalized
    return normalized + "/api/v1"


def build_headers() -> dict[str, str]:
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    api_token = os.environ.get("LM_API_TOKEN")
    if api_token:
        headers["Authorization"] = f"Bearer {api_token}"
    return headers


def unload_model(base_url: str, model: str, timeout: int) -> None:
    endpoint = f"{native_api_base_url(base_url)}/models/unload"
    payload = {"instance_id": model}
    request_data = json.dumps(payload).encode("utf-8")
    http_request = request.Request(
        endpoint,
        data=request_data,
        headers=build_headers(),
        method="POST",
    )

    try:
        with request.urlopen(http_request, timeout=timeout) as response:
            response.read()
    except error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        if exc.code == 404 and "model_not_found" in error_body:
            return
        raise RuntimeError(f"HTTP {exc.code} ao descarregar o modelo: {error_body}") from exc
    except error.URLError as exc:
        raise RuntimeError(
            f"Falha de conexao com o LM Studio no endpoint {endpoint}: {exc.reason}"
        ) from exc


def post_chat_completion(endpoint: str, payload: dict[str, Any], timeout: int) -> str:
    request_data = json.dumps(payload).encode("utf-8")
    http_request = request.Request(
        endpoint,
        data=request_data,
        headers=build_headers(),
        method="POST",
    )

    try:
        with request.urlopen(http_request, timeout=timeout) as response:
            return response.read().decode("utf-8")
    except error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code} ao chamar o modelo: {error_body}") from exc
    except error.URLError as exc:
        raise RuntimeError(
            f"Falha de conexao com o LM Studio no endpoint {endpoint}: {exc.reason}"
        ) from exc


def suggest_smaller_max_tokens(exc: Exception, current_max_tokens: int) -> Optional[int]:
    message = str(exc)
    match = re.search(
        r"request \((\d+) tokens\) exceeds the available context size \((\d+) tokens\)",
        message,
        flags=re.IGNORECASE,
    )
    if match is None:
        return None

    request_tokens = int(match.group(1))
    context_size = int(match.group(2))
    overflow = request_tokens - context_size
    if overflow <= 0:
        return None

    safety_margin = 32
    suggested = current_max_tokens - overflow - safety_margin
    minimum_allowed = 32
    if suggested < minimum_allowed:
        suggested = minimum_allowed

    if suggested >= current_max_tokens:
        return None

    return suggested


def extract_assistant_content(payload: dict[str, Any]) -> str:
    choices = payload.get("choices")
    if not isinstance(choices, list) or not choices:
        raise ValueError("Resposta da API sem 'choices'.")

    message = choices[0].get("message")
    if not isinstance(message, dict):
        raise ValueError("Resposta da API sem 'message'.")

    content = message.get("content")
    if isinstance(content, str):
        if content.strip():
            return content
        raise ValueError("Resposta do modelo veio vazia.")

    if isinstance(content, list):
        text_parts: list[str] = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                text = item.get("text")
                if isinstance(text, str) and text.strip():
                    text_parts.append(text)
        if text_parts:
            return "\n".join(text_parts)

    raise ValueError("Formato de 'content' nao suportado na resposta da API.")


def parse_model_response(raw_response: str) -> ModelResponse:
    json_text = extract_json_text(raw_response)
    parsed = json.loads(json_text)

    if not isinstance(parsed, dict):
        raise ValueError("A resposta do modelo nao e um objeto JSON.")

    flood_detected = parse_boolean_field(parsed.get("flood_detected"), "flood_detected")
    flood_level = parse_enum_field(parsed.get("flood_level"), "flood_level", FLOOD_LEVEL_VALUES)
    fraud_suspected = parse_boolean_field(
        parsed.get("fraud_suspected"),
        "fraud_suspected",
    )
    reason = parse_reason_field(parsed.get("reason"))

    return ModelResponse(
        flood_detected=flood_detected,
        flood_level=flood_level,
        fraud_suspected=fraud_suspected,
        reason=reason,
    )


def parse_boolean_field(value: Any, field_name: str) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized == "true":
            return True
        if normalized == "false":
            return False
    raise ValueError(f"Campo '{field_name}' ausente ou nao booleano.")


def parse_enum_field(value: Any, field_name: str, allowed_values: set[str]) -> str:
    if not isinstance(value, str):
        raise ValueError(f"Campo '{field_name}' ausente ou invalido.")

    normalized = value.strip().lower()
    if normalized not in allowed_values:
        allowed = ", ".join(sorted(allowed_values))
        raise ValueError(f"Campo '{field_name}' invalido. Valores aceitos: {allowed}.")
    return normalized


def parse_reason_field(value: Any) -> str:
    if not isinstance(value, str):
        raise ValueError("Campo 'reason' ausente ou invalido.")

    normalized = value.strip()
    if not normalized:
        raise ValueError("Campo 'reason' nao pode ser vazio.")
    return normalized


def extract_json_text(raw_response: str) -> str:
    cleaned = raw_response.strip()
    if not cleaned:
        raise ValueError("Resposta vazia do modelo.")

    if cleaned.startswith("```"):
        cleaned = strip_code_fences(cleaned)

    try:
        json.loads(cleaned)
        return cleaned
    except json.JSONDecodeError:
        pass

    start = cleaned.find("{")
    if start == -1:
        raise ValueError("Nenhum objeto JSON encontrado na resposta do modelo.")

    depth = 0
    for index in range(start, len(cleaned)):
        character = cleaned[index]
        if character == "{":
            depth += 1
        elif character == "}":
            depth -= 1
            if depth == 0:
                candidate = cleaned[start : index + 1]
                json.loads(candidate)
                return candidate

    raise ValueError("Objeto JSON incompleto na resposta do modelo.")


def strip_code_fences(content: str) -> str:
    lines = content.strip().splitlines()
    if lines and lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].strip() == "```":
        lines = lines[:-1]
    return "\n".join(lines).strip()


def build_error_results(
    image_name: str,
    models: Sequence[str],
    prompts: Sequence[PromptSpec],
    error_message: str,
) -> list[ExperimentResult]:
    return [
        ExperimentResult(
            image_name=image_name,
            model=model,
            prompt_id=prompt.prompt_id,
            flood_detected=None,
            flood_level=None,
            fraud_suspected=None,
            reason=None,
            error=error_message,
        )
        for model in models
        for prompt in prompts
    ]


def build_error_result(
    image_name: str,
    model: str,
    prompt: PromptSpec,
    error_message: str,
) -> ExperimentResult:
    return ExperimentResult(
        image_name=image_name,
        model=model,
        prompt_id=prompt.prompt_id,
        flood_detected=None,
        flood_level=None,
        fraud_suspected=None,
        reason=None,
        error=error_message,
    )


def run_experiment(
    images: Sequence[Path],
    models: Sequence[str],
    prompts: Sequence[PromptSpec],
    base_url: str,
    timeout: int,
    max_tokens: int,
    max_image_side: int,
    retry_image_sides: Sequence[int],
    unload_model_between_models: bool,
) -> list[ExperimentResult]:
    results: list[ExperimentResult] = []
    total_runs = len(images) * len(models) * len(prompts)
    current_run = 0

    encoded_images_by_path: dict[Path, list[EncodedImage]] = {}
    image_errors_by_path: dict[Path, str] = {}
    for image_path in images:
        try:
            encoded_images_by_path[image_path] = build_image_variants(
                image_path=image_path,
                max_image_side=max_image_side,
                retry_image_sides=retry_image_sides,
            )
        except Exception as exc:
            error_message = f"Falha ao ler/codificar imagem: {exc}"
            log(f"{error_message} ({image_path})")
            image_errors_by_path[image_path] = error_message

    for model in models:
        model_start_time = time.perf_counter()
        log(f"Iniciando modelo {model}")

        for prompt in prompts:
            prompt_start_time = time.perf_counter()
            log(f"Iniciando prompt {prompt.prompt_id} no modelo {model}")

            for image_path in images:
                current_run += 1
                image_error = image_errors_by_path.get(image_path)
                if image_error is not None:
                    log(
                        f"[{current_run}/{total_runs}] Pulando imagem {image_path.name} | "
                        f"modelo {model} | prompt {prompt.prompt_id}: {image_error}"
                    )
                    results.append(
                        build_error_result(
                            image_name=image_path.name,
                            model=model,
                            prompt=prompt,
                            error_message=image_error,
                        )
                    )
                    continue

                image_variants = encoded_images_by_path[image_path]
                encoded_image = image_variants[0]
                log(
                    f"[{current_run}/{total_runs}] Processando imagem {encoded_image.image_name} | "
                    f"modelo {model} | prompt {prompt.prompt_id} | "
                    f"{format_image_variant(encoded_image)}"
                )

                try:
                    raw_response = call_model(
                        base_url=base_url,
                        model=model,
                        prompt=prompt,
                        image_variants=image_variants,
                        timeout=timeout,
                        max_tokens=max_tokens,
                    )
                    parsed_response = parse_model_response(raw_response)
                    results.append(
                        ExperimentResult(
                            image_name=encoded_image.image_name,
                            model=model,
                            prompt_id=prompt.prompt_id,
                            flood_detected=parsed_response.flood_detected,
                            flood_level=parsed_response.flood_level,
                            fraud_suspected=parsed_response.fraud_suspected,
                            reason=parsed_response.reason,
                        )
                    )
                except Exception as exc:
                    log(
                        f"Erro em imagem={encoded_image.image_name} "
                        f"modelo={model} prompt={prompt.prompt_id}: {exc}"
                    )
                    results.append(
                        ExperimentResult(
                            image_name=encoded_image.image_name,
                            model=model,
                            prompt_id=prompt.prompt_id,
                            flood_detected=None,
                            flood_level=None,
                            fraud_suspected=None,
                            reason=None,
                            error=str(exc),
                        )
                    )
            prompt_elapsed = time.perf_counter() - prompt_start_time
            log(
                f"Prompt {prompt.prompt_id} no modelo {model} finalizado em "
                f"{format_duration(prompt_elapsed)}"
            )

        model_elapsed = time.perf_counter() - model_start_time
        log(f"Modelo {model} finalizado em {format_duration(model_elapsed)}")
        if unload_model_between_models:
            try:
                unload_model(base_url, model, timeout)
                log(f"Modelo {model} descarregado antes do proximo modelo")
            except Exception as exc:
                log(f"Aviso: nao foi possivel descarregar modelo {model}: {exc}")

    return results


def save_results(results: Sequence[ExperimentResult], output_csv: Path) -> None:
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "image_name",
        "model",
        "prompt_id",
        "flood_detected",
        "flood_level",
        "fraud_suspected",
        "reason",
        "error",
    ]

    with output_csv.open("w", encoding="utf-8", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for result in results:
            writer.writerow(
                {
                    "image_name": result.image_name,
                    "model": result.model,
                    "prompt_id": result.prompt_id,
                    "flood_detected": result.flood_detected,
                    "flood_level": result.flood_level,
                    "fraud_suspected": result.fraud_suspected,
                    "reason": result.reason,
                    "error": result.error,
                }
            )


def main() -> int:
    args = parse_args()

    try:
        requested_models = load_models()
        prompts = load_prompts()
        images = load_images(args.images_dir)
        retry_image_sides = parse_retry_image_sides(args.context_retry_image_sides)
    except Exception as exc:
        log(f"Erro de configuracao: {exc}")
        return 1

    if not images:
        log(f"Nenhuma imagem encontrada em {args.images_dir}")
        return 1

    try:
        available_models = list_available_models(args.base_url, args.timeout)
        models = resolve_models(requested_models, available_models)
    except Exception as exc:
        log(f"Erro ao resolver modelos no LM Studio: {exc}")
        return 1

    for requested, resolved in zip(requested_models, models):
        if requested != resolved:
            log(f"Modelo '{requested}' resolvido para '{resolved}'")

    total_runs = len(images) * len(models) * len(prompts)
    log("Iniciando experimento de deteccao de alagamentos com LM Studio")
    log(
        f"{len(images)} imagens | {len(models)} modelos | "
        f"{len(prompts)} prompts | {total_runs} execucoes"
    )
    if args.max_image_side > 0:
        log(f"Imagens serao enviadas com lado maximo inicial de {args.max_image_side}px")
    if retry_image_sides:
        retry_sides = ", ".join(f"{side}px" for side in retry_image_sides)
        log(f"Fallbacks de imagem menor em estouro de contexto: {retry_sides}")

    experiment_start_time = time.perf_counter()
    results = run_experiment(
        images=images,
        models=models,
        prompts=prompts,
        base_url=args.base_url,
        timeout=args.timeout,
        max_tokens=args.max_tokens,
        max_image_side=args.max_image_side,
        retry_image_sides=retry_image_sides,
        unload_model_between_models=args.unload_model_between_models,
    )
    save_results(results, args.output_csv)

    successful_runs = sum(result.error is None for result in results)
    failed_runs = len(results) - successful_runs
    experiment_elapsed = time.perf_counter() - experiment_start_time

    log(f"Resultados salvos em {args.output_csv}")
    log(f"Execucoes com sucesso: {successful_runs} | Execucoes com falha: {failed_runs}")
    log(f"Tempo total do experimento: {format_duration(experiment_elapsed)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
