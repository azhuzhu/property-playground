"""API endpoint tests."""

# The sample intentionally matches the Swagger example in housing_model.main.
# pylint: disable=duplicate-code

from fastapi.testclient import TestClient
from housing_model.main import app

SAMPLE = {
    "square_footage": 1550,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 1997,
    "lot_size": 6800,
    "distance_to_city_center": 4.1,
    "school_rating": 7.6,
}


def test_root_redirects_to_swagger() -> None:
    with TestClient(app) as client:
        response = client.get("/", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["location"] == "/docs"


def test_health() -> None:
    with TestClient(app) as client:
        response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "model_loaded": True}


def test_single_prediction() -> None:
    with TestClient(app) as client:
        response = client.post("/predict", json=SAMPLE)
    assert response.status_code == 200
    assert response.json()["prediction"] > 0
    assert set(response.json()) == {"prediction"}


def test_batch_prediction() -> None:
    with TestClient(app) as client:
        response = client.post("/predict", json=[SAMPLE, SAMPLE])
    assert response.status_code == 200
    assert len(response.json()["predictions"]) == 2
    assert set(response.json()) == {"predictions"}


def test_empty_batch_is_rejected() -> None:
    with TestClient(app) as client:
        response = client.post("/predict", json=[])
    assert response.status_code == 422


def test_invalid_payload_is_rejected() -> None:
    invalid = {**SAMPLE, "square_footage": -1}
    with TestClient(app) as client:
        response = client.post("/predict", json=invalid)
    assert response.status_code == 422


def test_model_info() -> None:
    with TestClient(app) as client:
        response = client.get("/model-info")
    body = response.json()
    assert response.status_code == 200
    assert body["model_type"] == "LinearRegression"
    assert body["currency"] == "USD"
    assert set(body["coefficients"]) == set(SAMPLE)
    assert {"r2", "mae", "rmse"} <= set(body["metrics"])
