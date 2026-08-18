package com.propertyplayground.contracts;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * EstimateResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class EstimateResponse {

  private Double prediction;

  /**
   * Gets or Sets model
   */
  public enum ModelEnum {
    HOUSING_PRICE_REGRESSION("housing-price-regression");

    private final String value;

    ModelEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static ModelEnum fromValue(String value) {
      for (ModelEnum b : ModelEnum.values()) {
        if (b.value.equals(value)) {
          return b;
        }
      }
      throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
  }

  private ModelEnum model = ModelEnum.HOUSING_PRICE_REGRESSION;

  public EstimateResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public EstimateResponse(Double prediction, ModelEnum model) {
    this.prediction = prediction;
    this.model = model;
  }

  public EstimateResponse prediction(Double prediction) {
    this.prediction = prediction;
    return this;
  }

  /**
   * Predicted sale price in U.S. dollars (USD).
   * @return prediction
   */
  @NotNull
  @Schema(name = "prediction", description = "Predicted sale price in U.S. dollars (USD).", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("prediction")
  public Double getPrediction() {
    return prediction;
  }

  public void setPrediction(Double prediction) {
    this.prediction = prediction;
  }

  public EstimateResponse model(ModelEnum model) {
    this.model = model;
    return this;
  }

  /**
   * Get model
   * @return model
   */
  @NotNull
  @Schema(name = "model", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("model")
  public ModelEnum getModel() {
    return model;
  }

  public void setModel(ModelEnum model) {
    this.model = model;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EstimateResponse estimateResponse = (EstimateResponse) o;
    return Objects.equals(this.prediction, estimateResponse.prediction) &&
        Objects.equals(this.model, estimateResponse.model);
  }

  @Override
  public int hashCode() {
    return Objects.hash(prediction, model);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EstimateResponse {\n");
    sb.append("    prediction: ").append(toIndentedString(prediction)).append("\n");
    sb.append("    model: ").append(toIndentedString(model)).append("\n");
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
