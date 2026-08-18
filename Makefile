CONTAINER_CLIENT ?= podman
CSV2JSON_VERSION ?= 2.0.2
CSV_INPUT ?= data/House Price Dataset.csv
JSON_OUTPUT ?= $(CSV_INPUT:.csv=.json)
CONTAINER_BUILD_FLAGS :=
COMPOSE_BUILD_ENV :=

ifeq ($(CONTAINER_CLIENT),podman)
CONTAINER_BUILD_FLAGS := --format docker
COMPOSE_BUILD_ENV := BUILDAH_FORMAT=docker
endif

.PHONY: contracts contracts-check csv-to-json install train run test lint portal-install portal-build java-test container-build container-run stack-build stack-up stack-down

contracts:
	python3 scripts/generate_contracts.py

contracts-check:
	python3 scripts/generate_contracts.py --check

csv-to-json:
	npx --yes csv2json@$(CSV2JSON_VERSION) --dynamic-typing "$(CSV_INPUT)" "$(JSON_OUTPUT)"

install:
	python3 -m pip install -r services/model-api/requirements-dev.txt

train:
	cd services/model-api && python3 -m scripts.train_model --data "../../data/House Price Dataset.csv"

run:
	cd services/model-api && DATASET_PATH="../../data/House Price Dataset.csv" python3 -m uvicorn housing_model.main:app --reload

test:
	python3 -m pytest -q

lint:
	python3 scripts/generate_contracts.py --check
	python3 -m ruff check .
	PYTHONPATH=contracts/generated/python python3 -m pylint scripts/generate_contracts.py services/model-api/housing_model services/model-api/scripts services/model-api/tests services/estimator-api/estimator_app services/estimator-api/tests

container-build:
	$(strip $(CONTAINER_CLIENT) build $(CONTAINER_BUILD_FLAGS) -f services/model-api/Dockerfile -t property-playground-model-api .)

container-run:
	$(CONTAINER_CLIENT) run --rm -p 8000:8000 property-playground-model-api

portal-install:
	cd portal && npm ci

portal-build:
	cd portal && npm run build

java-test:
	cd services/market-api && mvn test

stack-build:
	$(strip $(COMPOSE_BUILD_ENV) $(CONTAINER_CLIENT) compose build)

stack-up:
	$(strip $(COMPOSE_BUILD_ENV) $(CONTAINER_CLIENT) compose up --detach --build)

stack-down:
	$(CONTAINER_CLIENT) compose down
