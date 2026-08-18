FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1
WORKDIR /app
COPY services/estimator-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY contracts/generated/python/property_playground_contracts ./property_playground_contracts
COPY services/estimator-api/estimator_app ./estimator_app
RUN useradd --create-home --uid 10001 apiuser && chown -R apiuser:apiuser /app
USER apiuser
EXPOSE 8001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health', timeout=2)"
CMD ["uvicorn", "estimator_app.main:app", "--host", "0.0.0.0", "--port", "8001"]
