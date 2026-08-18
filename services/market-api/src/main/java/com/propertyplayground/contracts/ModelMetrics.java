package com.propertyplayground.contracts;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * ModelMetrics
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class ModelMetrics {

  private Double r2;

  private Double mae;

  private Double rmse;

  private Integer trainingSamples;

  private Integer testSamples;

  public ModelMetrics() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public ModelMetrics(Double r2, Double mae, Double rmse, Integer trainingSamples, Integer testSamples) {
    this.r2 = r2;
    this.mae = mae;
    this.rmse = rmse;
    this.trainingSamples = trainingSamples;
    this.testSamples = testSamples;
  }

  public ModelMetrics r2(Double r2) {
    this.r2 = r2;
    return this;
  }

  /**
   * Get r2
   * @return r2
   */
  @NotNull
  @Schema(name = "r2", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("r2")
  public Double getR2() {
    return r2;
  }

  public void setR2(Double r2) {
    this.r2 = r2;
  }

  public ModelMetrics mae(Double mae) {
    this.mae = mae;
    return this;
  }

  /**
   * Get mae
   * @return mae
   */
  @NotNull
  @Schema(name = "mae", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("mae")
  public Double getMae() {
    return mae;
  }

  public void setMae(Double mae) {
    this.mae = mae;
  }

  public ModelMetrics rmse(Double rmse) {
    this.rmse = rmse;
    return this;
  }

  /**
   * Get rmse
   * @return rmse
   */
  @NotNull
  @Schema(name = "rmse", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("rmse")
  public Double getRmse() {
    return rmse;
  }

  public void setRmse(Double rmse) {
    this.rmse = rmse;
  }

  public ModelMetrics trainingSamples(Integer trainingSamples) {
    this.trainingSamples = trainingSamples;
    return this;
  }

  /**
   * Get trainingSamples
   * @return trainingSamples
   */
  @NotNull
  @Schema(name = "training_samples", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("training_samples")
  public Integer getTrainingSamples() {
    return trainingSamples;
  }

  public void setTrainingSamples(Integer trainingSamples) {
    this.trainingSamples = trainingSamples;
  }

  public ModelMetrics testSamples(Integer testSamples) {
    this.testSamples = testSamples;
    return this;
  }

  /**
   * Get testSamples
   * @return testSamples
   */
  @NotNull
  @Schema(name = "test_samples", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("test_samples")
  public Integer getTestSamples() {
    return testSamples;
  }

  public void setTestSamples(Integer testSamples) {
    this.testSamples = testSamples;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ModelMetrics modelMetrics = (ModelMetrics) o;
    return Objects.equals(this.r2, modelMetrics.r2) &&
        Objects.equals(this.mae, modelMetrics.mae) &&
        Objects.equals(this.rmse, modelMetrics.rmse) &&
        Objects.equals(this.trainingSamples, modelMetrics.trainingSamples) &&
        Objects.equals(this.testSamples, modelMetrics.testSamples);
  }

  @Override
  public int hashCode() {
    return Objects.hash(r2, mae, rmse, trainingSamples, testSamples);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ModelMetrics {\n");
    sb.append("    r2: ").append(toIndentedString(r2)).append("\n");
    sb.append("    mae: ").append(toIndentedString(mae)).append("\n");
    sb.append("    rmse: ").append(toIndentedString(rmse)).append("\n");
    sb.append("    trainingSamples: ").append(toIndentedString(trainingSamples)).append("\n");
    sb.append("    testSamples: ").append(toIndentedString(testSamples)).append("\n");
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
