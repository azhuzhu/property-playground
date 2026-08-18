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
 * HealthResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class HealthResponse {

  private String status;

  private Boolean modelLoaded;

  public HealthResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public HealthResponse(String status, Boolean modelLoaded) {
    this.status = status;
    this.modelLoaded = modelLoaded;
  }

  public HealthResponse status(String status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
   */
  @NotNull
  @Schema(name = "status", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("status")
  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public HealthResponse modelLoaded(Boolean modelLoaded) {
    this.modelLoaded = modelLoaded;
    return this;
  }

  /**
   * Get modelLoaded
   * @return modelLoaded
   */
  @NotNull
  @Schema(name = "model_loaded", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("model_loaded")
  public Boolean getModelLoaded() {
    return modelLoaded;
  }

  public void setModelLoaded(Boolean modelLoaded) {
    this.modelLoaded = modelLoaded;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    HealthResponse healthResponse = (HealthResponse) o;
    return Objects.equals(this.status, healthResponse.status) &&
        Objects.equals(this.modelLoaded, healthResponse.modelLoaded);
  }

  @Override
  public int hashCode() {
    return Objects.hash(status, modelLoaded);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class HealthResponse {\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    modelLoaded: ").append(toIndentedString(modelLoaded)).append("\n");
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
