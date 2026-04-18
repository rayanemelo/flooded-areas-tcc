# Analise dos Resultados do Experimento

Este diretorio contem o script e os arquivos usados para analisar os resultados gerados em `experimentation/`.

## Objetivo

O foco desta etapa e consolidar os resultados do experimento, contabilizar acertos e erros por modelo e por prompt, e gerar graficos para facilitar a comparacao.

## Arquivos principais

- `analyze_results.py`: script principal de analise.
- `results.csv`: CSV de entrada com os resultados revisados.
- `requirements.txt`: dependencias necessarias para gerar tabelas e graficos.
- `output/`: pasta onde os artefatos visuais sao salvos.

## Requisitos

- Python 3 instalado.
- Dependencias do arquivo `requirements.txt`.

Instalacao rapida:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Formato esperado do CSV

O script espera um arquivo CSV com pelo menos estas colunas:

- `image_name`
- `model`
- `prompt_id`
- `flood_detected`
- `flood_level`
- `fraud_suspected`
- `correct_analysis`
- `reason`
- `error`

Observacoes sobre `correct_analysis`:

- e a coluna usada para definir se a resposta foi considerada correta ou incorreta;
- aceita valores como `true`, `false`, `1`, `0`, `sim`, `nao`;
- linhas sem valor valido nessa coluna sao ignoradas na analise final.

Na pratica, esse `results.csv` costuma ser uma versao enriquecida do CSV bruto gerado em `experimentation/`, apos revisao manual ou etiquetagem.

## Como rodar

Execute a analise a partir deste diretorio:

```bash
python3 analyze_results.py --input ./results.csv --output ./output
```

Parametros disponiveis:

- `--input`: caminho do CSV de entrada. Padrao: `results.csv`.
- `--output`: pasta onde os graficos serao salvos. Padrao: `output`.

## O que o script faz

Ao rodar, o script:

- le o CSV e normaliza valores booleanos;
- remove linhas sem `correct_analysis` valido;
- calcula rankings de acertos e erros por `model` e `prompt_id`;
- calcula a taxa de acerto por `prompt_id` dentro de cada `model`;
- gera um resumo textual no terminal;
- salva graficos e tabelas em imagem na pasta de saida.

## Arquivos gerados em `output/`

O processo salva estes artefatos:

- `flood_detected_distribution.png`
- `fraud_suspected_distribution.png`
- `flood_level_counts.png`
- `summary_metrics.png`
- `rankings_tables.png`
- `accuracy_by_model_prompt_tables.png`
- `ranking_hits_by_model_pie.png`
- `ranking_errors_by_model_pie.png`
- `ranking_hits_by_prompt_pie.png`
- `ranking_errors_by_prompt_pie.png`

## Interpretacao dos rankings

- `hits_by_model`: quantidade de linhas com `correct_analysis = true` por modelo.
- `errors_by_model`: quantidade de linhas com `correct_analysis = false` por modelo.
- `hits_by_prompt`: quantidade de linhas com `correct_analysis = true` por prompt.
- `errors_by_prompt`: quantidade de linhas com `correct_analysis = false` por prompt.
- `accuracy_by_model_prompt`: para cada combinacao de `model` e `prompt_id`, mostra `total`, `hits`, `errors` e `taxa_acerto_pct`.

## Observacoes

- O script nao altera o CSV de entrada.
- Se nenhum registro valido for encontrado apos a limpeza, nenhuma analise e gerada.
- O diretorio `output/` e criado automaticamente, se necessario.
