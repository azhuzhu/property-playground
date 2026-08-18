# Property Playground

A containerised FastAPI service that trains a scikit-learn linear regression model and serves single or batch housing-price predictions. Interactive Swagger documentation is available at `/docs`.

The synthetic dataset is interpreted as a generic U.S. suburban housing market. Prices and
predictions use U.S. dollars (USD), areas use square feet, and distance uses miles.

The cross-service API is defined contract-first in `contracts/openapi.yaml`. `make contracts` runs the
pinned OpenAPI Generator image with Podman (or Docker via `CONTAINER_CLIENT=docker`) to produce the
Python/Pydantic, Java/Spring, and TypeScript/Fetch models consumed by each application.
Run `make contracts` after changing that contract; `make contracts-check` verifies that the generated
Pydantic, TypeScript, and Java bindings are current.

Convert any CSV file to a typed JSON array with the pinned `csv2json` CLI:

```bash
npx --yes csv2json@2.0.2 --dynamic-typing input.csv output.json
```

For the training dataset, run `make csv-to-json`. Override `CSV_INPUT` and `JSON_OUTPUT` to convert
another file.

## Run locally

Python 3.12 or newer is required.

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r services/model-api/requirements-dev.txt
make train
make run
```

Open <http://localhost:8000> for the interview demo; the root URL redirects directly to Swagger UI at `/docs`.

By default, training uses the attached `data/House Price Dataset.csv`. The interview prediction inputs are in `data/Test Data For Prediction.csv`. A replacement training CSV must contain the seven API feature columns and a target named `median_house_value`, `price`, or `target`. If the default file is unavailable, the app can still start using deterministic fallback data.

```bash
cd services/model-api
python3 -m scripts.train_model --data path/to/housing.csv
```

## API

- `POST /predict` accepts either one feature object or an array of feature objects.
- `GET /model-info` returns the algorithm, coefficients, intercept, data source, and held-out R²/MAE/RMSE metrics.
- `GET /health` confirms the API and model are ready.

Single prediction:

```bash
curl -X POST http://localhost:8000/predict \
  -H 'Content-Type: application/json' \
  -d '{
    "square_footage": 1550,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 1997,
    "lot_size": 6800,
    "distance_to_city_center": 4.1,
    "school_rating": 7.6
  }'
```

For a batch request, send an array containing one or more objects in the same format.

## Containers

```bash
make container-build
make container-run
```

Podman is the default container client. To use Docker instead, set `CONTAINER_CLIENT=docker`:

```bash
make container-build CONTAINER_CLIENT=docker
make container-run CONTAINER_CLIENT=docker
make stack-up CONTAINER_CLIENT=docker
```

On macOS, start the Podman virtual machine first with `podman machine start` (run `podman machine init` once if it has not been created). Podman builds use Docker-compatible image format so health checks are retained. Images train and embed the model during the build and run as unprivileged users.

## Multi-application portal (Task 2)

The repository also contains **Property Playground**, a unified Next.js portal with two independently backed applications:

- **Property value estimator** (`/estimator`) uses the dedicated FastAPI service in `services/estimator-api`, which validates submissions and calls this model API. It includes field validation, visual and tabular results, browser-local history, and a comparison route.
- **Property market analysis** (`/market`) uses the Java 21 / Spring Boot 3.4.4 service in `services/market-api`. It calculates and caches dataset aggregates, provides filtering and sortable tables, calls the model for what-if analysis, and exports CSV and PDF files.

All three backends are self-contained under `services/`: `model-api` contains the `housing_model` Python package from Task 1, `estimator-api` handles the App 1 workflow, and `market-api` contains the Spring Boot application.

The Next.js App Router frontend uses React Server Components for initial market loading and client components for interactive workflows. Browser requests pass through Next.js route handlers, so internal backend addresses are never exposed to the client.

Start all four services with the selected Compose client:

```bash
make stack-up
```

After the stack starts, the command prints the portal, Swagger, and health-check URLs. Run
`make stack-urls` at any time to display them again.

Then open:

- Portal: <http://localhost:3000>
- Model Swagger (full stack): <http://localhost:8002/docs>
- Estimator Swagger: <http://localhost:8001/docs>
- Java health endpoint: <http://localhost:8080/actuator/health>

Stop the stack with `make stack-down`. Build individual application layers with `make portal-build`, `make java-test`, or `make stack-build`.

## Test

```bash
make test
make lint
```
