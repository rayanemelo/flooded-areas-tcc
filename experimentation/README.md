# Experimento de Deteccao de Alagamento

Este repositorio contem um script Python para rodar um experimento de deteccao de alagamento em imagens usando modelos locais via LM Studio.

## O que precisa estar ativo

- Python 3 instalado na maquina.
- LM Studio aberto.
- O servidor local do LM Studio iniciado com API compativel com OpenAI em `http://localhost:1234/v1`.
- Pelo menos um modelo carregado no LM Studio.

## Arquivos de configuracao

O experimento le sempre destes arquivos locais:

- models.json: lista de modelos a testar.
- prompts.json: lista de prompts do experimento.

Modelos configurados atualmente:

- `qwen/qwen3-vl-8b`
- `mistralai/ministral-3-3b`

Observacao:

- Em algumas instalacoes o LM Studio expoe um modelo com outro ID, por exemplo `qwen3-vl-8b-instruct`.
- O script tenta resolver automaticamente esse tipo de alias usando o endpoint `/v1/models`.

## Prompts disponiveis

O arquivo `prompts.json` ja vem com duas opcoes:

- `forensic_detailed`: analise mais detalhada de autenticidade, fraude, qualidade e alagamento.
- `flood_minimal`: analise mais direta e objetiva.

Os dois prompts retornam o mesmo schema JSON:

- `image_valid`
- `flood_detected`
- `flood_level`
- `fraud_suspected`
- `confidence`
- `evidence_quality`
- `water_coverage`
- `scene_consistency`
- `manipulation_probability`
- `ai_generated_probability`
- `reason`

## Como rodar

```bash
python3 script.py --images-dir ./images --output-csv ./outputs/flood_detection_results.csv
```

## Como alterar modelos e prompts

Para mudar os modelos do experimento, edite `models.json`.

Exemplo:

```json
{
  "models": ["qwen/qwen3-vl-8b", "mistralai/ministral-3-3b"]
}
```

Para mudar os prompts do experimento, edite `prompts.json`.

Exemplo:

```json
{
  "prompts": [
    {
      "id": "meu_prompt",
      "system_prompt": "Voce e um especialista em deteccao de alagamento.",
      "user_prompt": "Analise a imagem e retorne apenas JSON."
    }
  ]
}
```

## Formato do CSV

O CSV final contem:

- `image_name`
- `model`
- `prompt_id`
- `image_valid`
- `flood_detected`
- `flood_level`
- `fraud_suspected`
- `confidence`
- `evidence_quality`
- `water_coverage`
- `scene_consistency`
- `manipulation_probability`
- `ai_generated_probability`
- `reason`
- `error`

## Observacoes

- O script faz uma chamada por combinacao `imagem x modelo x prompt`.
- Se uma chamada falhar ou o modelo devolver JSON invalido, a execucao continua e o erro e registrado no CSV.
- O script nao espera prompts ou modelos por linha de comando; tudo vem de `prompts.json` e `models.json`.
- Este README foi preparado para execucao manual posterior. Nenhum teste foi executado nesta etapa.
