from __future__ import annotations

import argparse
import base64
import csv
import io
import json
import mimetypes
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
- "image_valid": boolean
- "flood_detected": boolean
- "flood_level": "none|leve|moderado|interditado"
- "fraud_suspected": boolean
- "confidence": number between 0 and 1
- "evidence_quality": "high|medium|low"
- "water_coverage": "none|small|medium|large"
- "scene_consistency": number between 0 and 1
- "manipulation_probability": number between 0 and 1
- "ai_generated_probability": number between 0 and 1
- "reason": short string
Do not add markdown, explanations, extra keys, or commentary.
""".strip()

FLOOD_LEVEL_VALUES = {"none", "leve", "moderado", "interditado"}
EVIDENCE_QUALITY_VALUES = {"high", "medium", "low"}
WATER_COVERAGE_VALUES = {"none", "small", "medium", "large"}
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


@dataclass(frozen=True)
class ModelResponse:
    image_valid: bool
    flood_detected: bool
    flood_level: str
    fraud_suspected: bool
    confidence: float
    evidence_quality: str
    water_coverage: str
    scene_consistency: float
    manipulation_probability: float
    ai_generated_probability: float
    reason: str


@dataclass(frozen=True)
class ExperimentResult:
    image_name: str
    model: str
    prompt_id: str
    image_valid: Optional[bool]
    flood_detected: Optional[bool]
    flood_level: Optional[str]
    fraud_suspected: Optional[bool]
    confidence: Optional[float]
    evidence_quality: Optional[str]
    water_coverage: Optional[str]
    scene_consistency: Optional[float]
    manipulation_probability: Optional[float]
    ai_generated_probability: Optional[float]
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


def encode_image_to_base64(image_path: Path) -> EncodedImage:
    mime_type = mimetypes.guess_type(image_path.name)[0] or "application/octet-stream"
    image_bytes = image_path.read_bytes()

    if mime_type not in INLINE_SAFE_IMAGE_MIME_TYPES:
        image_bytes, mime_type = convert_image_to_png(image_bytes)

    encoded = base64.b64encode(image_bytes).decode("ascii")
    return EncodedImage(
        image_name=image_path.name,
        image_path=image_path.resolve(),
        mime_type=mime_type,
        base64_data=encoded,
    )


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
    image: EncodedImage,
    timeout: int = 120,
    max_tokens: int = 400,
) -> str:
    endpoint = f"{base_url.rstrip('/')}/chat/completions"
    image_data_url = f"data:{image.mime_type};base64,{image.base64_data}"
    system_instruction = prompt.system_prompt or SYSTEM_PROMPT

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

    last_error: Optional[Exception] = None
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
                overflow_adjustment = suggest_smaller_max_tokens(exc, current_max_tokens)
                if overflow_adjustment is not None and overflow_adjustment < current_max_tokens:
                    log(
                        f"Contexto excedido para modelo {model}; reduzindo max_tokens "
                        f"de {current_max_tokens} para {overflow_adjustment} e tentando novamente"
                    )
                    current_max_tokens = overflow_adjustment
                    continue

                if "base64 encoded image" not in str(exc).lower():
                    raise RuntimeError(
                        f"HTTP ao chamar o modelo '{model}': {exc}"
                    ) from exc
                break

    assert last_error is not None
    raise RuntimeError(f"HTTP ao chamar o modelo '{model}': {last_error}") from last_error


def post_chat_completion(endpoint: str, payload: dict[str, Any], timeout: int) -> str:
    request_data = json.dumps(payload).encode("utf-8")
    http_request = request.Request(
        endpoint,
        data=request_data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
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

    image_valid = parse_boolean_field(parsed.get("image_valid"), "image_valid")
    flood_detected = parse_boolean_field(parsed.get("flood_detected"), "flood_detected")
    flood_level = parse_enum_field(parsed.get("flood_level"), "flood_level", FLOOD_LEVEL_VALUES)
    fraud_suspected = parse_boolean_field(
        parsed.get("fraud_suspected"),
        "fraud_suspected",
    )
    confidence_value = parse_probability_field(parsed.get("confidence"), "confidence")
    evidence_quality = parse_enum_field(
        parsed.get("evidence_quality"),
        "evidence_quality",
        EVIDENCE_QUALITY_VALUES,
    )
    water_coverage = parse_enum_field(
        parsed.get("water_coverage"),
        "water_coverage",
        WATER_COVERAGE_VALUES,
    )
    scene_consistency = parse_probability_field(
        parsed.get("scene_consistency"),
        "scene_consistency",
    )
    manipulation_probability = parse_probability_field(
        parsed.get("manipulation_probability"),
        "manipulation_probability",
    )
    ai_generated_probability = parse_probability_field(
        parsed.get("ai_generated_probability"),
        "ai_generated_probability",
    )
    reason = parse_reason_field(parsed.get("reason"))

    return ModelResponse(
        image_valid=image_valid,
        flood_detected=flood_detected,
        flood_level=flood_level,
        fraud_suspected=fraud_suspected,
        confidence=round(confidence_value, 6),
        evidence_quality=evidence_quality,
        water_coverage=water_coverage,
        scene_consistency=round(scene_consistency, 6),
        manipulation_probability=round(manipulation_probability, 6),
        ai_generated_probability=round(ai_generated_probability, 6),
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


def parse_probability_field(value: Any, field_name: str) -> float:
    if isinstance(value, bool):
        raise ValueError(f"Campo '{field_name}' deve ser numerico entre 0.0 e 1.0.")

    if isinstance(value, (int, float)):
        parsed_value = float(value)
    elif isinstance(value, str):
        try:
            parsed_value = float(value.strip())
        except ValueError as exc:
            raise ValueError(
                f"Campo '{field_name}' deve ser numerico entre 0.0 e 1.0."
            ) from exc
    else:
        raise ValueError(f"Campo '{field_name}' deve ser numerico entre 0.0 e 1.0.")

    if not 0.0 <= parsed_value <= 1.0:
        raise ValueError(f"Campo '{field_name}' deve estar entre 0.0 e 1.0.")
    return parsed_value


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
            image_valid=None,
            flood_detected=None,
            flood_level=None,
            fraud_suspected=None,
            confidence=None,
            evidence_quality=None,
            water_coverage=None,
            scene_consistency=None,
            manipulation_probability=None,
            ai_generated_probability=None,
            reason=None,
            error=error_message,
        )
        for model in models
        for prompt in prompts
    ]


def run_experiment(
    images: Sequence[Path],
    models: Sequence[str],
    prompts: Sequence[PromptSpec],
    base_url: str,
    timeout: int,
    max_tokens: int,
) -> list[ExperimentResult]:
    results: list[ExperimentResult] = []
    total_runs = len(images) * len(models) * len(prompts)
    current_run = 0

    for image_path in images:
        image_start_time = time.perf_counter()
        try:
            encoded_image = encode_image_to_base64(image_path)
        except Exception as exc:
            error_message = f"Falha ao ler/codificar imagem: {exc}"
            log(f"{error_message} ({image_path})")
            results.extend(build_error_results(image_path.name, models, prompts, error_message))
            current_run += len(models) * len(prompts)
            image_elapsed = time.perf_counter() - image_start_time
            log(
                f"Imagem {image_path.name} finalizada em {format_duration(image_elapsed)}"
            )
            continue

        for model in models:
            for prompt in prompts:
                current_run += 1
                log(
                    f"[{current_run}/{total_runs}] Processando imagem {encoded_image.image_name} | "
                    f"modelo {model} | prompt {prompt.prompt_id}"
                )

                try:
                    raw_response = call_model(
                        base_url=base_url,
                        model=model,
                        prompt=prompt,
                        image=encoded_image,
                        timeout=timeout,
                        max_tokens=max_tokens,
                    )
                    parsed_response = parse_model_response(raw_response)
                    results.append(
                        ExperimentResult(
                            image_name=encoded_image.image_name,
                            model=model,
                            prompt_id=prompt.prompt_id,
                            image_valid=parsed_response.image_valid,
                            flood_detected=parsed_response.flood_detected,
                            flood_level=parsed_response.flood_level,
                            fraud_suspected=parsed_response.fraud_suspected,
                            confidence=parsed_response.confidence,
                            evidence_quality=parsed_response.evidence_quality,
                            water_coverage=parsed_response.water_coverage,
                            scene_consistency=parsed_response.scene_consistency,
                            manipulation_probability=parsed_response.manipulation_probability,
                            ai_generated_probability=parsed_response.ai_generated_probability,
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
                            image_valid=None,
                            flood_detected=None,
                            flood_level=None,
                            fraud_suspected=None,
                            confidence=None,
                            evidence_quality=None,
                            water_coverage=None,
                            scene_consistency=None,
                            manipulation_probability=None,
                            ai_generated_probability=None,
                            reason=None,
                            error=str(exc),
                        )
                    )

        image_elapsed = time.perf_counter() - image_start_time
        log(
            f"Imagem {encoded_image.image_name} finalizada em {format_duration(image_elapsed)}"
        )

    return results


def save_results(results: Sequence[ExperimentResult], output_csv: Path) -> None:
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "image_name",
        "model",
        "prompt_id",
        "image_valid",
        "flood_detected",
        "flood_level",
        "fraud_suspected",
        "confidence",
        "evidence_quality",
        "water_coverage",
        "scene_consistency",
        "manipulation_probability",
        "ai_generated_probability",
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
                    "image_valid": result.image_valid,
                    "flood_detected": result.flood_detected,
                    "flood_level": result.flood_level,
                    "fraud_suspected": result.fraud_suspected,
                    "confidence": result.confidence,
                    "evidence_quality": result.evidence_quality,
                    "water_coverage": result.water_coverage,
                    "scene_consistency": result.scene_consistency,
                    "manipulation_probability": result.manipulation_probability,
                    "ai_generated_probability": result.ai_generated_probability,
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

    experiment_start_time = time.perf_counter()
    results = run_experiment(
        images=images,
        models=models,
        prompts=prompts,
        base_url=args.base_url,
        timeout=args.timeout,
        max_tokens=args.max_tokens,
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
