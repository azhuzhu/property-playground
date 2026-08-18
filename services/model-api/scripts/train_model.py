from __future__ import annotations

import argparse
from pathlib import Path

from housing_model.modeling import artifact_summary, train_and_save


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the housing price regression model")
    parser.add_argument("--data", type=Path, help="CSV training data (optional)")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("housing_model/model/housing_model.joblib"),
        help="Destination for the serialized model",
    )
    args = parser.parse_args()
    default_datasets = [
        Path("data/House Price Dataset.csv"),
        Path("../../data/House Price Dataset.csv"),
    ]
    default_dataset = next((path for path in default_datasets if path.exists()), None)
    data_path = args.data or default_dataset
    print(artifact_summary(train_and_save(args.output, data_path)))


if __name__ == "__main__":
    main()
