from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

FEATURE_NAMES = [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "year_built",
    "lot_size",
    "distance_to_city_center",
    "school_rating",
]
TARGET_CANDIDATES = ("median_house_value", "price", "target")
MODEL_VERSION = "1.0.0"


def _fallback_data(rows: int = 5_000, seed: int = 42) -> tuple[pd.DataFrame, pd.Series]:
    """Create deterministic, housing-like data when no external CSV is supplied."""
    rng = np.random.default_rng(seed)
    frame = pd.DataFrame(
        {
            "square_footage": rng.uniform(600, 4_000, rows),
            "bedrooms": rng.integers(1, 7, rows),
            "bathrooms": rng.integers(2, 9, rows) / 2,
            "year_built": rng.integers(1950, 2026, rows),
            "lot_size": rng.uniform(2_000, 20_000, rows),
            "distance_to_city_center": rng.uniform(0.2, 30, rows),
            "school_rating": rng.uniform(1, 10, rows),
        }
    )
    value = (
        -350_000
        + frame["square_footage"] * 115
        + frame["bedrooms"] * 8_000
        + frame["bathrooms"] * 16_000
        + frame["year_built"] * 180
        + frame["lot_size"] * 2.5
        - frame["distance_to_city_center"] * 2_500
        + frame["school_rating"] * 12_000
        + rng.normal(0, 25_000, rows)
    )
    return frame, pd.Series(np.maximum(value, 20_000), name="median_house_value")


def load_training_data(csv_path: Path | None) -> tuple[pd.DataFrame, pd.Series, str]:
    if csv_path is None:
        features, target = _fallback_data()
        return features, target, "deterministic synthetic fallback"

    frame = pd.read_csv(csv_path)
    missing = sorted(set(FEATURE_NAMES) - set(frame.columns))
    if missing:
        raise ValueError(f"CSV is missing feature columns: {', '.join(missing)}")
    target_name = next((name for name in TARGET_CANDIDATES if name in frame.columns), None)
    if target_name is None:
        raise ValueError(f"CSV needs one target column: {', '.join(TARGET_CANDIDATES)}")

    selected = frame[FEATURE_NAMES + [target_name]].dropna()
    if len(selected) < 10:
        raise ValueError("At least 10 complete rows are required for training")
    return selected[FEATURE_NAMES], selected[target_name], str(csv_path)


def train_and_save(output_path: Path, csv_path: Path | None = None) -> dict[str, Any]:
    features, target, source = load_training_data(csv_path)
    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42
    )
    model = LinearRegression()
    model.fit(x_train, y_train)
    predicted = model.predict(x_test)
    metrics = {
        "r2": float(r2_score(y_test, predicted)),
        "mae": float(mean_absolute_error(y_test, predicted)),
        "rmse": float(mean_squared_error(y_test, predicted) ** 0.5),
        "test_samples": int(len(y_test)),
        "training_samples": int(len(y_train)),
    }
    artifact = {
        "model": model,
        "feature_names": FEATURE_NAMES,
        "metrics": metrics,
        "model_type": type(model).__name__,
        "model_version": MODEL_VERSION,
        "training_source": source,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, output_path)
    return {key: value for key, value in artifact.items() if key != "model"}


def artifact_summary(artifact: dict[str, Any]) -> str:
    return json.dumps({key: value for key, value in artifact.items() if key != "model"}, indent=2)
