"""Tests for estimator request validation and model integration."""

# The sample intentionally follows the shared model API contract.
# pylint: disable=duplicate-code

from unittest.mock import AsyncMock, patch

import httpx
from estimator_app.main import app
from fastapi.testclient import TestClient

SAMPLE = {
    "square_footage": 1550,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 1997,
    "lot_size": 6800,
    "distance_to_city_center": 4.1,
    "school_rating": 7.6,
}


def test_estimate_proxies_model_prediction() -> None:
    response = httpx.Response(200, json={"prediction": 258061.41})
    with patch("httpx.AsyncClient.post", new=AsyncMock(return_value=response)):
        result = TestClient(app).post("/api/estimates", json=SAMPLE)
    assert result.status_code == 200
    assert result.json()["prediction"] == 258061.41
    assert set(result.json()) == {"prediction", "model"}


def test_estimate_validates_input() -> None:
    result = TestClient(app).post("/api/estimates", json={**SAMPLE, "school_rating": 11})
    assert result.status_code == 422
