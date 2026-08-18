from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated

import joblib
import pandas as pd
from fastapi import Body, FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse

from housing_model.modeling import FEATURE_NAMES, train_and_save
from housing_model.schemas import (
    BatchPrediction,
    HealthResponse,
    HousingFeatures,
    ModelInfo,
    PredictionResponse,
)

DEFAULT_MODEL_PATH = Path(__file__).parent / "model" / "housing_model.joblib"
DEFAULT_DATASET_PATH = Path("data/House Price Dataset.csv")


@asynccontextmanager
async def lifespan(application: FastAPI):
    model_path = Path(os.getenv("MODEL_PATH", str(DEFAULT_MODEL_PATH)))
    if not model_path.exists():
        dataset_path = Path(os.getenv("DATASET_PATH", str(DEFAULT_DATASET_PATH)))
        train_and_save(model_path, dataset_path if dataset_path.exists() else None)
    application.state.artifact = joblib.load(model_path)
    yield
    application.state.artifact = None


app = FastAPI(
    title="Property Playground Model API",
    description="Predict a housing price from one feature set or a batch of feature sets.",
    version="1.0.0",
    lifespan=lifespan,
)


PredictionInput = Annotated[
    HousingFeatures | list[HousingFeatures],
    Body(
        openapi_examples={
            "single": {
                "summary": "One property",
                "value": {
                    "square_footage": 1550,
                    "bedrooms": 3,
                    "bathrooms": 2,
                    "year_built": 1997,
                    "lot_size": 6800,
                    "distance_to_city_center": 4.1,
                    "school_rating": 7.6,
                },
            },
            "batch": {
                "summary": "Multiple properties",
                "value": [
                    {
                        "square_footage": 1550,
                        "bedrooms": 3,
                        "bathrooms": 2,
                        "year_built": 1997,
                        "lot_size": 6800,
                        "distance_to_city_center": 4.1,
                        "school_rating": 7.6,
                    },
                    {
                        "square_footage": 2200,
                        "bedrooms": 4,
                        "bathrooms": 2.5,
                        "year_built": 2008,
                        "lot_size": 9600,
                        "distance_to_city_center": 7,
                        "school_rating": 8.8,
                    },
                ],
            },
        }
    ),
]


@app.get("/", include_in_schema=False)
def docs_redirect() -> RedirectResponse:
    """Make the interview demo URL open Swagger immediately."""
    return RedirectResponse(url="/docs")


@app.post(
    "/predict",
    response_model=PredictionResponse | BatchPrediction,
    summary="Predict one or more housing prices",
)
def predict(payload: PredictionInput, request: Request) -> PredictionResponse | BatchPrediction:
    is_batch = isinstance(payload, list)
    rows = payload if is_batch else [payload]
    if not rows:
        raise HTTPException(status_code=422, detail="At least one feature set is required")

    frame = pd.DataFrame([row.model_dump() for row in rows], columns=FEATURE_NAMES)
    predictions = request.app.state.artifact["model"].predict(frame)
    values = [round(max(0.0, float(value)), 2) for value in predictions]
    if is_batch:
        return BatchPrediction(predictions=values)
    return PredictionResponse(prediction=values[0])


@app.get("/model-info", response_model=ModelInfo, summary="Show model metadata and quality metrics")
def model_info(request: Request) -> ModelInfo:
    artifact = request.app.state.artifact
    model = artifact["model"]
    return ModelInfo(
        model_type=artifact["model_type"],
        model_version=artifact["model_version"],
        feature_names=artifact["feature_names"],
        coefficients=dict(zip(artifact["feature_names"], map(float, model.coef_), strict=True)),
        intercept=float(model.intercept_),
        metrics=artifact["metrics"],
        training_source=artifact["training_source"],
        currency="USD",
    )


@app.get("/health", response_model=HealthResponse, summary="Check service health")
def health(request: Request) -> HealthResponse:
    loaded = getattr(request.app.state, "artifact", None) is not None
    if not loaded:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    return HealthResponse(status="healthy", model_loaded=True)
