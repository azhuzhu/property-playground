# Property Playground — Agent Handoff

## Project summary

This repository contains two interview tasks combined as a Podman-oriented monorepo:

1. A housing-price regression API built with Python 3.12+, FastAPI, pandas, and scikit-learn.
2. A unified Next.js portal containing a Python-backed property estimator and a Java-backed market-analysis application.

The synthetic dataset represents a generic U.S. suburban housing market. Treat every dataset price,
model prediction, aggregate, chart value, and export as U.S. dollars (USD). Areas use square feet and
distance uses miles; do not present the data as belonging to a specific city.

Cross-service housing request and prediction shapes are owned by `contracts/housing.schema.json`.
Do not edit generated Python, TypeScript, or Java contract files directly. Run `make contracts` after
schema changes and keep `make contracts-check` passing.

Use descriptive service package names. The original generic root `app/` package was deliberately renamed and moved into `services/model-api/housing_model/`.

## Repository layout

```text
data/
  House Price Dataset.csv
  Test Data For Prediction.csv
portal/                          # Next.js 16 App Router and Tailwind CSS
services/
  model-api/                    # Task 1 FastAPI/scikit-learn service
    housing_model/
    scripts/
    tests/
  estimator-api/                # App 1 FastAPI boundary service
    estimator_app/
    tests/
  market-api/                   # App 2 Java 21 / Spring Boot 3.4.4 service
compose.yaml                    # Complete four-container stack
Makefile
```

## Architecture and behavior

- `model-api` owns model training and the `/predict`, `/model-info`, and `/health` endpoints. `/predict` accepts either one property object or an array.
- `estimator-api` validates estimator submissions at `/api/estimates` and calls `model-api` over the internal Compose network.
- `market-api` loads the housing CSV, caches filtered lists and aggregates, exposes market summary/property endpoints, calls `model-api` for `/api/market/what-if`, and generates CSV/PDF exports.
- `portal` is the only browser-facing application. Its Next.js route handlers proxy backend calls so internal service addresses are not exposed to client components.
- The estimator stores up to 20 previous estimates in browser local storage and supports comparison of up to four properties.
- The market page uses a React Server Component for initial loading and client components for filters, sorting, what-if controls, and exports.

The shared model input fields are:

```text
square_footage
bedrooms
bathrooms
year_built
lot_size
distance_to_city_center
school_rating
```

## Development conventions

- Use `python3`, including in Make targets. Prefer `python3 -m <tool>`.
- Run both Ruff and Pylint for Python linting. The current Pylint baseline is `10.00/10`.
- Container targets use `CONTAINER_CLIENT`, which defaults to `podman` and can be set to `docker`. Do not hard-code an engine in new Make targets.
- Podman builds automatically use Docker image format so health checks are retained; Docker builds omit the Podman-specific flag.
- Keep each backend self-contained under `services/`; do not recreate generic root `app/`, `scripts/`, or `tests/` directories.
- Keep datasets under `data/`; update Python, Java, tests, and container COPY paths together if they move.
- Containers run as unprivileged users.
- Preserve Next.js App Router server/client component boundaries, accessible labels and errors, responsive Tailwind layouts, and shared design-system classes in `portal/app/globals.css`.

## Common commands

```bash
make install          # Install model API Python development dependencies
make train            # Train from data/House Price Dataset.csv
make run              # Run model API locally
make test             # Run model API tests
make lint             # Ruff and Pylint across both Python services
make portal-install   # npm ci
make portal-build     # Next.js production build
make java-test        # Spring Boot tests when Maven/Java are installed
make container-build  # Build Task 1 using the default Podman client
make container-run    # Run Task 1 using the default Podman client
make stack-build      # Build all images with the selected Compose client
make stack-up         # Build and start the complete stack
make stack-down       # Stop and remove Compose resources
```

Use Docker for any container or Compose target by appending `CONTAINER_CLIENT=docker`, for example `make stack-up CONTAINER_CLIENT=docker`.

Run estimator API tests separately from its service directory:

```bash
cd services/estimator-api
../../.venv/bin/python -m pytest -q
```

Run portal quality checks with:

```bash
cd portal
npm run lint
npm run build
npm audit --omit=dev
```

## Ports

- Portal: `http://localhost:3000`
- Estimator API Swagger: `http://localhost:8001/docs`
- Market API: `http://localhost:8080`
- Composed model API Swagger: `http://localhost:8002/docs`
- Standalone model API: `http://localhost:8000`

Compose intentionally publishes its model API on host port 8002 because port 8000 was already occupied during development. Internal services always use `http://model-api:8000`.

## Last verified state

- Model API tests: 7 passed.
- Estimator API tests: 2 passed.
- Java aggregation test passed inside the Java 21 container build.
- Ruff, Pylint, ESLint, TypeScript, and Next.js production builds passed.
- Next.js was upgraded to 16.3.1 after an audit; the final production npm audit reported zero vulnerabilities.
- Podman end-to-end checks passed for all portal routes, both prediction paths, filtered market data, CSV export, and a valid two-page PDF export.
- Representative predictions were `258061.41` through the estimator and `283029.81` through Java what-if analysis.
