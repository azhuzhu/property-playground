FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY services/market-api/pom.xml .
COPY services/market-api/src ./src
COPY ["data/House Price Dataset.csv", "./data/House Price Dataset.csv"]
RUN mvn package -B -q

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /build/target/market-api-1.0.0.jar ./market-api.jar
COPY ["data/House Price Dataset.csv", "/app/data/housing.csv"]
RUN useradd --create-home --uid 10001 apiuser && chown -R apiuser:apiuser /app
USER apiuser
ENV DATASET_PATH=/app/data/housing.csv
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD ["bash", "-c", "exec 3<>/dev/tcp/127.0.0.1/8080"]
ENTRYPOINT ["java", "-jar", "/app/market-api.jar"]
