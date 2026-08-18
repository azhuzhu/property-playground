FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY services/model-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY contracts/generated/python/property_playground_contracts ./property_playground_contracts
COPY services/model-api/housing_model ./housing_model
COPY services/model-api/scripts ./scripts
COPY ["data/House Price Dataset.csv", "./data/House Price Dataset.csv"]
RUN python -m scripts.train_model

RUN useradd --create-home --uid 10001 apiuser && chown -R apiuser:apiuser /app
USER apiuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=2)"

CMD ["uvicorn", "housing_model.main:app", "--host", "0.0.0.0", "--port", "8000"]
