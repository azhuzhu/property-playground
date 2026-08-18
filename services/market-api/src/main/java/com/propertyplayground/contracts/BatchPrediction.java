package com.propertyplayground.contracts;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.lang.Nullable;
import com.fasterxml.jackson.annotation.JsonTypeName;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * BatchPrediction
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class BatchPrediction implements Predict200Response {

  @Valid
  private List<Double> predictions = new ArrayList<>();

  public BatchPrediction() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public BatchPrediction(List<Double> predictions) {
    this.predictions = predictions;
  }

  public BatchPrediction predictions(List<Double> predictions) {
    this.predictions = predictions;
    return this;
  }

  public BatchPrediction addPredictionsItem(Double predictionsItem) {
    if (this.predictions == null) {
      this.predictions = new ArrayList<>();
    }
    this.predictions.add(predictionsItem);
    return this;
  }

  /**
   * Get predictions
   * @return predictions
   */
  @NotNull
  @Schema(name = "predictions", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("predictions")
  public List<Double> getPredictions() {
    return predictions;
  }

  public void setPredictions(List<Double> predictions) {
    this.predictions = predictions;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    BatchPrediction batchPrediction = (BatchPrediction) o;
    return Objects.equals(this.predictions, batchPrediction.predictions);
  }

  @Override
  public int hashCode() {
    return Objects.hash(predictions);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class BatchPrediction {\n");
    sb.append("    predictions: ").append(toIndentedString(predictions)).append("\n");
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
