from __future__ import annotations

import os

import httpx
from fastapi import FastAPI, HTTPException
from property_playground_contracts import EstimateResponse, HousingFeatures
from pydantic import BaseModel

MODEL_API_URL = os.getenv("MODEL_API_URL", "http://localhost:8000")


class HealthResponse(BaseModel):
    status: str
    model_api: str


app = FastAPI(
    title="Property Estimator Backend",
    description="Validates estimator submissions and delegates predictions to the shared ML API.",
    version="1.0.0",
)


@app.post("/api/estimates", response_model=EstimateResponse)
async def create_estimate(payload: HousingFeatures) -> EstimateResponse:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(f"{MODEL_API_URL}/predict", json=payload.model_dump())
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail="Prediction model is unavailable") from exc

    if response.status_code == 422:
        raise HTTPException(status_code=422, detail="The model rejected the supplied property data")
    if response.is_error:
        raise HTTPException(status_code=502, detail="Prediction model returned an error")
    return EstimateResponse(prediction=response.json()["prediction"])


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    try:
        async with httpx.AsyncClient(timeout=2) as client:
            response = await client.get(f"{MODEL_API_URL}/health")
        model_status = "available" if response.is_success else "unavailable"
    except httpx.RequestError:
        model_status = "unavailable"
    return HealthResponse(status="healthy", model_api=model_status)
