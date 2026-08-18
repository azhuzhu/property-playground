package com.propertyplayground.contracts;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.propertyplayground.contracts.ModelMetrics;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * ModelInfo
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class ModelInfo {

  private String modelType;

  private String modelVersion;

  @Valid
  private List<String> featureNames = new ArrayList<>();

  @Valid
  private Map<String, Double> coefficients = new HashMap<>();

  private Double intercept;

  private ModelMetrics metrics;

  private String trainingSource;

  public ModelInfo() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public ModelInfo(String modelType, String modelVersion, List<String> featureNames, Map<String, Double> coefficients, Double intercept, ModelMetrics metrics, String trainingSource) {
    this.modelType = modelType;
    this.modelVersion = modelVersion;
    this.featureNames = featureNames;
    this.coefficients = coefficients;
    this.intercept = intercept;
    this.metrics = metrics;
    this.trainingSource = trainingSource;
  }

  public ModelInfo modelType(String modelType) {
    this.modelType = modelType;
    return this;
  }

  /**
   * Get modelType
   * @return modelType
   */
  @NotNull
  @Schema(name = "model_type", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("model_type")
  public String getModelType() {
    return modelType;
  }

  public void setModelType(String modelType) {
    this.modelType = modelType;
  }

  public ModelInfo modelVersion(String modelVersion) {
    this.modelVersion = modelVersion;
    return this;
  }

  /**
   * Get modelVersion
   * @return modelVersion
   */
  @NotNull
  @Schema(name = "model_version", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("model_version")
  public String getModelVersion() {
    return modelVersion;
  }

  public void setModelVersion(String modelVersion) {
    this.modelVersion = modelVersion;
  }

  public ModelInfo featureNames(List<String> featureNames) {
    this.featureNames = featureNames;
    return this;
  }

  public ModelInfo addFeatureNamesItem(String featureNamesItem) {
    if (this.featureNames == null) {
      this.featureNames = new ArrayList<>();
    }
    this.featureNames.add(featureNamesItem);
    return this;
  }

  /**
   * Get featureNames
   * @return featureNames
   */
  @NotNull
  @Schema(name = "feature_names", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("feature_names")
  public List<String> getFeatureNames() {
    return featureNames;
  }

  public void setFeatureNames(List<String> featureNames) {
    this.featureNames = featureNames;
  }

  public ModelInfo coefficients(Map<String, Double> coefficients) {
    this.coefficients = coefficients;
    return this;
  }

  public ModelInfo putCoefficientsItem(String key, Double coefficientsItem) {
    if (this.coefficients == null) {
      this.coefficients = new HashMap<>();
    }
    this.coefficients.put(key, coefficientsItem);
    return this;
  }

  /**
   * Get coefficients
   * @return coefficients
   */
  @NotNull
  @Schema(name = "coefficients", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("coefficients")
  public Map<String, Double> getCoefficients() {
    return coefficients;
  }

  public void setCoefficients(Map<String, Double> coefficients) {
    this.coefficients = coefficients;
  }

  public ModelInfo intercept(Double intercept) {
    this.intercept = intercept;
    return this;
  }

  /**
   * Get intercept
   * @return intercept
   */
  @NotNull
  @Schema(name = "intercept", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("intercept")
  public Double getIntercept() {
    return intercept;
  }

  public void setIntercept(Double intercept) {
    this.intercept = intercept;
  }

  public ModelInfo metrics(ModelMetrics metrics) {
    this.metrics = metrics;
    return this;
  }

  /**
   * Get metrics
   * @return metrics
   */
  @NotNull @Valid
  @Schema(name = "metrics", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("metrics")
  public ModelMetrics getMetrics() {
    return metrics;
  }

  public void setMetrics(ModelMetrics metrics) {
    this.metrics = metrics;
  }

  public ModelInfo trainingSource(String trainingSource) {
    this.trainingSource = trainingSource;
    return this;
  }

  /**
   * Get trainingSource
   * @return trainingSource
   */
  @NotNull
  @Schema(name = "training_source", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("training_source")
  public String getTrainingSource() {
    return trainingSource;
  }

  public void setTrainingSource(String trainingSource) {
    this.trainingSource = trainingSource;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ModelInfo modelInfo = (ModelInfo) o;
    return Objects.equals(this.modelType, modelInfo.modelType) &&
        Objects.equals(this.modelVersion, modelInfo.modelVersion) &&
        Objects.equals(this.featureNames, modelInfo.featureNames) &&
        Objects.equals(this.coefficients, modelInfo.coefficients) &&
        Objects.equals(this.intercept, modelInfo.intercept) &&
        Objects.equals(this.metrics, modelInfo.metrics) &&
        Objects.equals(this.trainingSource, modelInfo.trainingSource);
  }

  @Override
  public int hashCode() {
    return Objects.hash(modelType, modelVersion, featureNames, coefficients, intercept, metrics, trainingSource);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ModelInfo {\n");
    sb.append("    modelType: ").append(toIndentedString(modelType)).append("\n");
    sb.append("    modelVersion: ").append(toIndentedString(modelVersion)).append("\n");
    sb.append("    featureNames: ").append(toIndentedString(featureNames)).append("\n");
    sb.append("    coefficients: ").append(toIndentedString(coefficients)).append("\n");
    sb.append("    intercept: ").append(toIndentedString(intercept)).append("\n");
    sb.append("    metrics: ").append(toIndentedString(metrics)).append("\n");
    sb.append("    trainingSource: ").append(toIndentedString(trainingSource)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}
