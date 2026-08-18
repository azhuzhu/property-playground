from __future__ import annotations

from typing import Literal

from property_playground_contracts import HousingFeatures, PredictionResponse
from pydantic import BaseModel


class BatchPrediction(BaseModel):
    predictions: list[float]


class ModelMetrics(BaseModel):
    r2: float
    mae: float
    rmse: float
    training_samples: int
    test_samples: int


class ModelInfo(BaseModel):
    model_type: str
    model_version: str
    feature_names: list[str]
    coefficients: dict[str, float]
    intercept: float
    metrics: ModelMetrics
    training_source: str
    currency: Literal["USD"] = "USD"


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


__all__ = [
    "BatchPrediction",
    "HealthResponse",
    "HousingFeatures",
    "ModelInfo",
    "ModelMetrics",
    "PredictionResponse",
]
