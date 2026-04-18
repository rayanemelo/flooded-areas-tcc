import argparse
from pathlib import Path
from typing import Dict, Optional

import matplotlib.pyplot as plt
import pandas as pd

PALETTE = [
    "#0096c7",
    "#48cae4",
    "#90e0ef",
    "#ade8f4",
    "#caf0f8",
    "#a9d6e5",
    "#7dd3fc",
    "#e0f2fe",
]


def normalize_bool(value: object) -> Optional[bool]:
    """Normalize common boolean representations to True/False/None."""
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None

    text = str(value).strip().lower()
    if text in {"true", "t", "1", "yes", "y", "sim", "s"}:
        return True
    if text in {"false", "f", "0", "no", "n", "nao", "não"}:
        return False
    if text in {"", "none", "null", "nan", "na"}:
        return None
    return None


def normalize_detected_label(value: object) -> str:
    """Normalize binary-like values for plotting distribution."""
    parsed = normalize_bool(value)
    if parsed is True:
        return "true"
    if parsed is False:
        return "false"

    text = str(value).strip().lower()
    if text in {"", "none", "null", "nan", "na"}:
        return "unknown"
    return text


def describe_distribution(series: pd.Series) -> str:
    """Return a compact textual description of value counts."""
    if series.empty:
        return "Sem dados"
    return ", ".join([f"{idx}: {int(val)}" for idx, val in series.items()])


def read_and_clean_data(csv_path: Path) -> pd.DataFrame:
    """Read CSV and keep only rows with valid correct_analysis values."""
    if not csv_path.exists():
        raise FileNotFoundError(f"Arquivo nao encontrado: {csv_path}")

    df = pd.read_csv(csv_path, dtype=str, keep_default_na=True)

    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].str.strip()

    df["correct_analysis"] = df["correct_analysis"].apply(normalize_bool)

    # Ignore rows where correct_analysis is missing/none/invalid.
    df = df[df["correct_analysis"].notna()].copy()
    df["correct_analysis"] = df["correct_analysis"].astype(bool)

    if "flood_detected" in df.columns:
        df["flood_detected_normalized"] = df["flood_detected"].apply(
            normalize_detected_label
        )
    else:
        df["flood_detected_normalized"] = "unknown"

    if "fraud_suspected" in df.columns:
        df["fraud_suspected_normalized"] = df["fraud_suspected"].apply(
            normalize_detected_label
        )
    else:
        df["fraud_suspected_normalized"] = "unknown"

    if "flood_level" in df.columns:
        normalized_level = (
            df["flood_level"].fillna("unknown").astype(str).str.strip().str.lower()
        )
        df["flood_level_normalized"] = normalized_level.replace(
            {"": "unknown", "none": "unknown", "null": "unknown", "nan": "unknown"}
        )
    else:
        df["flood_level_normalized"] = "unknown"

    return df


def build_ranking(
    df: pd.DataFrame, group_col: str, success_value: bool
) -> pd.DataFrame:
    """Build ranking counts grouped by model or prompt for success/error."""
    filtered = df[df["correct_analysis"] == success_value]
    ranking = (
        filtered.groupby(group_col, dropna=False)
        .size()
        .reset_index(name="count")
        .sort_values(by=["count", group_col], ascending=[False, True])
        .reset_index(drop=True)
    )
    return ranking


def build_accuracy_by_model_prompt(df: pd.DataFrame) -> pd.DataFrame:
    """Build accuracy table for each prompt within each model."""
    accuracy = (
        df.groupby(["model", "prompt_id"], dropna=False)["correct_analysis"]
        .agg(total="size", hits="sum")
        .reset_index()
    )
    accuracy["total"] = accuracy["total"].astype(int)
    accuracy["hits"] = accuracy["hits"].astype(int)
    accuracy["errors"] = accuracy["total"] - accuracy["hits"]
    accuracy["taxa_acerto_pct"] = (
        accuracy["hits"].div(accuracy["total"]).mul(100).round(2)
    )

    return (
        accuracy.sort_values(
            by=["model", "taxa_acerto_pct", "hits", "prompt_id"],
            ascending=[True, False, False, True],
        )
        .reset_index(drop=True)
        .loc[:, ["model", "prompt_id", "total", "hits", "errors", "taxa_acerto_pct"]]
    )


def calculate_metrics(df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Calculate all required ranking tables."""
    return {
        "hits_by_model": build_ranking(df, "model", True),
        "errors_by_model": build_ranking(df, "model", False),
        "hits_by_prompt": build_ranking(df, "prompt_id", True),
        "errors_by_prompt": build_ranking(df, "prompt_id", False),
        "accuracy_by_model_prompt": build_accuracy_by_model_prompt(df),
    }


def _get_pie_colors(size: int) -> list[str]:
    """Return a deterministic color list with fallback cycling."""
    return [PALETTE[i % len(PALETTE)] for i in range(size)]


def save_pie_chart(series: pd.Series, title: str, output_file: Path) -> Path:
    """Save a pie chart using standardized style and color palette."""
    if series.empty:
        plt.figure(figsize=(8, 6))
        plt.text(0.5, 0.5, "Sem dados disponiveis", ha="center", va="center")
        plt.axis("off")
        plt.title(title)
        plt.tight_layout()
        plt.savefig(output_file, dpi=150)
        plt.close()
        return output_file

    total = float(series.sum())

    def autopct_with_count(pct: float) -> str:
        count = int(round(pct * total / 100.0))
        return f"{pct:.1f}% ({count})"

    plt.figure(figsize=(8, 6))
    plt.pie(
        series.values,
        labels=[str(label) for label in series.index],
        autopct=autopct_with_count,
        startangle=140,
        colors=_get_pie_colors(len(series)),
        wedgeprops={"linewidth": 1, "edgecolor": "white"},
        textprops={"fontsize": 10},
    )
    plt.title(title)
    plt.axis("equal")
    plt.tight_layout()
    plt.savefig(output_file, dpi=150)
    plt.close()
    return output_file


def save_flood_level_chart(df: pd.DataFrame, output_dir: Path) -> Path:
    """Save pie chart with number of records by flood_level."""
    counts = df["flood_level_normalized"].value_counts(dropna=False)
    output_file = output_dir / "flood_level_counts.png"
    return save_pie_chart(counts, "Distribuicao por flood_level", output_file)


def save_flood_detected_chart(df: pd.DataFrame, output_dir: Path) -> Path:
    """Save pie chart with normalized flood_detected distribution."""
    counts = df["flood_detected_normalized"].value_counts(dropna=False)
    output_file = output_dir / "flood_detected_distribution.png"
    return save_pie_chart(counts, "Distribuicao de flood_detected", output_file)


def save_fraud_suspected_chart(df: pd.DataFrame, output_dir: Path) -> Path:
    """Save pie chart with normalized fraud_suspected distribution."""
    counts = df["fraud_suspected_normalized"].value_counts(dropna=False)
    output_file = output_dir / "fraud_suspected_distribution.png"
    return save_pie_chart(counts, "Distribuicao de fraud_suspected", output_file)


def save_ranking_pie_charts(
    metrics: Dict[str, pd.DataFrame], output_dir: Path
) -> list[Path]:
    """Save pie charts for hit/error rankings by model and prompt."""
    files: list[Path] = []

    chart_specs = [
        (
            "hits_by_model",
            "model",
            "Acertos por model",
            "ranking_hits_by_model_pie.png",
        ),
        (
            "errors_by_model",
            "model",
            "Erros por model",
            "ranking_errors_by_model_pie.png",
        ),
        (
            "hits_by_prompt",
            "prompt_id",
            "Acertos por prompt_id",
            "ranking_hits_by_prompt_pie.png",
        ),
        (
            "errors_by_prompt",
            "prompt_id",
            "Erros por prompt_id",
            "ranking_errors_by_prompt_pie.png",
        ),
    ]

    for metric_key, label_col, title, filename in chart_specs:
        ranking = metrics[metric_key]
        series = (
            ranking.set_index(label_col)["count"]
            if not ranking.empty
            else pd.Series(dtype=int)
        )
        files.append(save_pie_chart(series, title, output_dir / filename))

    return files


def format_percentage(value: float) -> str:
    """Format percentage values with two decimal places."""
    return f"{value:.2f}%"


def save_summary_metrics_image(
    df: pd.DataFrame, metrics: Dict[str, pd.DataFrame], output_dir: Path
) -> Path:
    """Save a summary image with global numbers and top entries."""

    def top_text(ranking: pd.DataFrame, col: str) -> str:
        if ranking.empty:
            return "Sem dados"
        row = ranking.iloc[0]
        return f"{row[col]} ({int(row['count'])})"

    fraud_counts = df["fraud_suspected_normalized"].value_counts(dropna=False)

    lines = [
        "RESUMO DA ANALISE",
        "",
        f"Registros totais apos limpeza: {len(df)}",
        f"Acertos (correct_analysis=true): {int((df['correct_analysis'] == True).sum())}",
        f"Erros (correct_analysis=false): {int((df['correct_analysis'] == False).sum())}",
        f"Fraud_suspected (distribuicao): {describe_distribution(fraud_counts)}",
        "",
        f"1) Model com maior numero de acertos: {top_text(metrics['hits_by_model'], 'model')}",
        f"2) Model com maior numero de erros: {top_text(metrics['errors_by_model'], 'model')}",
        f"3) Prompt_id com maior numero de acertos: {top_text(metrics['hits_by_prompt'], 'prompt_id')}",
        f"4) Prompt_id com maior numero de erros: {top_text(metrics['errors_by_prompt'], 'prompt_id')}",
    ]

    plt.figure(figsize=(12, 7))
    ax = plt.gca()
    ax.axis("off")
    ax.text(
        0.02,
        0.98,
        "\n".join(lines),
        va="top",
        ha="left",
        fontsize=12,
        family="monospace",
        bbox={
            "facecolor": "#f7f9fc",
            "edgecolor": "#d9e2ec",
            "boxstyle": "round,pad=0.6",
        },
    )
    plt.tight_layout()

    output_file = output_dir / "summary_metrics.png"
    plt.savefig(output_file, dpi=150)
    plt.close()
    return output_file


def _draw_table(ax: plt.Axes, title: str, table_df: pd.DataFrame) -> None:
    """Draw a styled generic table into an axis."""
    ax.axis("off")
    ax.set_title(title, fontsize=11, pad=10)

    if table_df.empty:
        ax.text(0.5, 0.5, "Sem dados", ha="center", va="center")
        return

    table = ax.table(
        cellText=table_df.values,
        colLabels=table_df.columns,
        loc="center",
        cellLoc="left",
    )
    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1, 1.3)

    for (row, col), cell in table.get_celld().items():
        if row == 0:
            cell.set_facecolor("#1f77b4")
            cell.set_text_props(color="white", weight="bold")
        else:
            cell.set_facecolor("#f7f9fc" if row % 2 == 0 else "white")


def _draw_ranking_table(ax: plt.Axes, title: str, ranking: pd.DataFrame) -> None:
    """Draw a styled ranking table into an axis."""
    table_df = ranking.copy()
    if not table_df.empty:
        table_df["count"] = table_df["count"].astype(int)
    _draw_table(ax, title, table_df)


def _draw_accuracy_table(ax: plt.Axes, title: str, accuracy: pd.DataFrame) -> None:
    """Draw a styled accuracy table by prompt within each model."""
    if accuracy.empty:
        _draw_table(ax, title, accuracy)
        return

    table_df = accuracy.loc[
        :, ["prompt_id", "total", "hits", "errors", "taxa_acerto_pct"]
    ].copy()
    table_df["total"] = table_df["total"].astype(int)
    table_df["hits"] = table_df["hits"].astype(int)
    table_df["errors"] = table_df["errors"].astype(int)
    table_df["taxa_acerto_pct"] = table_df["taxa_acerto_pct"].map(format_percentage)
    _draw_table(ax, title, table_df)


def save_rankings_table_image(
    metrics: Dict[str, pd.DataFrame], output_dir: Path
) -> Path:
    """Save an image containing the four full ranking tables."""
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))
    _draw_ranking_table(axes[0, 0], "Acertos por model", metrics["hits_by_model"])
    _draw_ranking_table(axes[0, 1], "Erros por model", metrics["errors_by_model"])
    _draw_ranking_table(axes[1, 0], "Acertos por prompt_id", metrics["hits_by_prompt"])
    _draw_ranking_table(axes[1, 1], "Erros por prompt_id", metrics["errors_by_prompt"])
    fig.tight_layout()

    output_file = output_dir / "rankings_tables.png"
    fig.savefig(output_file, dpi=150)
    plt.close(fig)
    return output_file


def save_accuracy_by_model_prompt_image(
    metrics: Dict[str, pd.DataFrame], output_dir: Path
) -> Path:
    """Save one table per model with prompt accuracy metrics."""
    accuracy = metrics["accuracy_by_model_prompt"]
    grouped_accuracy = list(accuracy.groupby("model", dropna=False, sort=False))

    if not grouped_accuracy:
        fig, ax = plt.subplots(1, 1, figsize=(14, 4))
        _draw_accuracy_table(
            ax,
            "Taxa de acerto por prompt dentro de cada model",
            accuracy,
        )
        fig.tight_layout()
        output_file = output_dir / "accuracy_by_model_prompt_tables.png"
        fig.savefig(output_file, dpi=150)
        plt.close(fig)
        return output_file

    figure_height = max(
        4,
        sum(max(2.8, 0.55 * (len(model_df) + 3)) for _, model_df in grouped_accuracy),
    )
    fig, axes = plt.subplots(len(grouped_accuracy), 1, figsize=(14, figure_height))

    if len(grouped_accuracy) == 1:
        axes = [axes]

    for ax, (model_name, model_df) in zip(axes, grouped_accuracy):
        _draw_accuracy_table(
            ax,
            f"Taxa de acerto por prompt - {model_name}",
            model_df,
        )

    fig.tight_layout()
    output_file = output_dir / "accuracy_by_model_prompt_tables.png"
    fig.savefig(output_file, dpi=150)
    plt.close(fig)
    return output_file


def print_top_result(title: str, ranking: pd.DataFrame, key_col: str) -> None:
    """Print top element for a ranking table."""
    print(f"\n{title}")
    if ranking.empty:
        print("Sem dados apos filtros.")
        return

    top_row = ranking.iloc[0]
    print(f"Maior: {top_row[key_col]} ({int(top_row['count'])})")


def print_ranking(title: str, ranking: pd.DataFrame, key_col: str) -> None:
    """Print full ranking table."""
    print(f"\n{title}")
    if ranking.empty:
        print("Sem dados apos filtros.")
        return

    printable = ranking.copy()
    printable["count"] = printable["count"].astype(int)
    print(printable.to_string(index=False))


def print_accuracy_by_model_prompt(accuracy: pd.DataFrame) -> None:
    """Print prompt accuracy tables segmented by model."""
    print("\nTaxa de acerto por prompt dentro de cada model:")
    if accuracy.empty:
        print("Sem dados apos filtros.")
        return

    for model_name, model_df in accuracy.groupby("model", dropna=False, sort=False):
        printable = model_df.loc[
            :, ["prompt_id", "total", "hits", "errors", "taxa_acerto_pct"]
        ].copy()
        printable["total"] = printable["total"].astype(int)
        printable["hits"] = printable["hits"].astype(int)
        printable["errors"] = printable["errors"].astype(int)
        printable["taxa_acerto_pct"] = printable["taxa_acerto_pct"].map(
            format_percentage
        )

        print(f"\nModel: {model_name}")
        print(printable.to_string(index=False))


def print_summary(df: pd.DataFrame, metrics: Dict[str, pd.DataFrame]) -> None:
    """Print textual summary with top metrics and full rankings."""
    print("=" * 70)
    print("RESUMO DA ANALISE")
    print("=" * 70)
    print(f"Registros totais apos limpeza: {len(df)}")
    print(
        f"Acertos (correct_analysis=true): {int((df['correct_analysis'] == True).sum())}"
    )
    print(
        f"Erros (correct_analysis=false): {int((df['correct_analysis'] == False).sum())}"
    )
    print(
        "Fraud_suspected (distribuicao): "
        f"{describe_distribution(df['fraud_suspected_normalized'].value_counts(dropna=False))}"
    )

    print_top_result(
        "1) Model com maior numero de acertos:", metrics["hits_by_model"], "model"
    )
    print_top_result(
        "2) Model com maior numero de erros:", metrics["errors_by_model"], "model"
    )
    print_top_result(
        "3) Prompt_id com maior numero de acertos:",
        metrics["hits_by_prompt"],
        "prompt_id",
    )
    print_top_result(
        "4) Prompt_id com maior numero de erros:",
        metrics["errors_by_prompt"],
        "prompt_id",
    )

    print_ranking(
        "\nRanking completo de acertos por model:", metrics["hits_by_model"], "model"
    )
    print_ranking(
        "\nRanking completo de erros por model:", metrics["errors_by_model"], "model"
    )
    print_ranking(
        "\nRanking completo de acertos por prompt_id:",
        metrics["hits_by_prompt"],
        "prompt_id",
    )
    print_ranking(
        "\nRanking completo de erros por prompt_id:",
        metrics["errors_by_prompt"],
        "prompt_id",
    )
    print_accuracy_by_model_prompt(metrics["accuracy_by_model_prompt"])


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Analisa resultados de deteccao de alagamento."
    )
    parser.add_argument(
        "--input",
        default="results.csv",
        help="Caminho do CSV de entrada (padrao: results.csv).",
    )
    parser.add_argument(
        "--output",
        default="output",
        help="Pasta de saida para graficos (padrao: output).",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    df = read_and_clean_data(input_path)

    if df.empty:
        print("Nenhum registro valido encontrado apos limpeza de correct_analysis.")
        return

    metrics = calculate_metrics(df)
    print_summary(df, metrics)

    saved_files = [
        save_flood_level_chart(df, output_dir),
        save_flood_detected_chart(df, output_dir),
        save_fraud_suspected_chart(df, output_dir),
        save_summary_metrics_image(df, metrics, output_dir),
        save_rankings_table_image(metrics, output_dir),
        save_accuracy_by_model_prompt_image(metrics, output_dir),
    ]
    saved_files.extend(save_ranking_pie_charts(metrics, output_dir))

    print("\nGraficos salvos em:")
    for file_path in saved_files:
        print(f"- {file_path}")


if __name__ == "__main__":
    main()
