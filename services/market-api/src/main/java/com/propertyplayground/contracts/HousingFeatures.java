package com.propertyplayground.contracts;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.lang.Nullable;
import com.fasterxml.jackson.annotation.JsonTypeName;
import java.util.List;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * HousingFeatures
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class HousingFeatures implements PredictRequest {

  private Double squareFootage;

  private Double bedrooms;

  private Double bathrooms;

  private Integer yearBuilt;

  private Double lotSize;

  private Double distanceToCityCenter;

  private Double schoolRating;

  public HousingFeatures() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public HousingFeatures(Double squareFootage, Double bedrooms, Double bathrooms, Integer yearBuilt, Double lotSize, Double distanceToCityCenter, Double schoolRating) {
    this.squareFootage = squareFootage;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.yearBuilt = yearBuilt;
    this.lotSize = lotSize;
    this.distanceToCityCenter = distanceToCityCenter;
    this.schoolRating = schoolRating;
  }

  public HousingFeatures squareFootage(Double squareFootage) {
    this.squareFootage = squareFootage;
    return this;
  }

  /**
   * Get squareFootage
   * minimum: 0
   * @return squareFootage
   */
  @NotNull @DecimalMin(value = "0", inclusive = false)
  @Schema(name = "square_footage", example = "1550", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("square_footage")
  public Double getSquareFootage() {
    return squareFootage;
  }

  public void setSquareFootage(Double squareFootage) {
    this.squareFootage = squareFootage;
  }

  public HousingFeatures bedrooms(Double bedrooms) {
    this.bedrooms = bedrooms;
    return this;
  }

  /**
   * Get bedrooms
   * minimum: 0
   * maximum: 20
   * @return bedrooms
   */
  @NotNull @DecimalMin("0") @DecimalMax("20")
  @Schema(name = "bedrooms", example = "3", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("bedrooms")
  public Double getBedrooms() {
    return bedrooms;
  }

  public void setBedrooms(Double bedrooms) {
    this.bedrooms = bedrooms;
  }

  public HousingFeatures bathrooms(Double bathrooms) {
    this.bathrooms = bathrooms;
    return this;
  }

  /**
   * Get bathrooms
   * minimum: 0
   * maximum: 20
   * @return bathrooms
   */
  @NotNull @DecimalMin("0") @DecimalMax("20")
  @Schema(name = "bathrooms", example = "2", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("bathrooms")
  public Double getBathrooms() {
    return bathrooms;
  }

  public void setBathrooms(Double bathrooms) {
    this.bathrooms = bathrooms;
  }

  public HousingFeatures yearBuilt(Integer yearBuilt) {
    this.yearBuilt = yearBuilt;
    return this;
  }

  /**
   * Get yearBuilt
   * minimum: 1700
   * maximum: 2200
   * @return yearBuilt
   */
  @NotNull @Min(1700) @Max(2200)
  @Schema(name = "year_built", example = "1997", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("year_built")
  public Integer getYearBuilt() {
    return yearBuilt;
  }

  public void setYearBuilt(Integer yearBuilt) {
    this.yearBuilt = yearBuilt;
  }

  public HousingFeatures lotSize(Double lotSize) {
    this.lotSize = lotSize;
    return this;
  }

  /**
   * Get lotSize
   * minimum: 0
   * @return lotSize
   */
  @NotNull @DecimalMin(value = "0", inclusive = false)
  @Schema(name = "lot_size", example = "6800", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("lot_size")
  public Double getLotSize() {
    return lotSize;
  }

  public void setLotSize(Double lotSize) {
    this.lotSize = lotSize;
  }

  public HousingFeatures distanceToCityCenter(Double distanceToCityCenter) {
    this.distanceToCityCenter = distanceToCityCenter;
    return this;
  }

  /**
   * Get distanceToCityCenter
   * minimum: 0
   * @return distanceToCityCenter
   */
  @NotNull @DecimalMin("0")
  @Schema(name = "distance_to_city_center", example = "4.1", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("distance_to_city_center")
  public Double getDistanceToCityCenter() {
    return distanceToCityCenter;
  }

  public void setDistanceToCityCenter(Double distanceToCityCenter) {
    this.distanceToCityCenter = distanceToCityCenter;
  }

  public HousingFeatures schoolRating(Double schoolRating) {
    this.schoolRating = schoolRating;
    return this;
  }

  /**
   * Get schoolRating
   * minimum: 0
   * maximum: 10
   * @return schoolRating
   */
  @NotNull @DecimalMin("0") @DecimalMax("10")
  @Schema(name = "school_rating", example = "7.6", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("school_rating")
  public Double getSchoolRating() {
    return schoolRating;
  }

  public void setSchoolRating(Double schoolRating) {
    this.schoolRating = schoolRating;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    HousingFeatures housingFeatures = (HousingFeatures) o;
    return Objects.equals(this.squareFootage, housingFeatures.squareFootage) &&
        Objects.equals(this.bedrooms, housingFeatures.bedrooms) &&
        Objects.equals(this.bathrooms, housingFeatures.bathrooms) &&
        Objects.equals(this.yearBuilt, housingFeatures.yearBuilt) &&
        Objects.equals(this.lotSize, housingFeatures.lotSize) &&
        Objects.equals(this.distanceToCityCenter, housingFeatures.distanceToCityCenter) &&
        Objects.equals(this.schoolRating, housingFeatures.schoolRating);
  }

  @Override
  public int hashCode() {
    return Objects.hash(squareFootage, bedrooms, bathrooms, yearBuilt, lotSize, distanceToCityCenter, schoolRating);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class HousingFeatures {\n");
    sb.append("    squareFootage: ").append(toIndentedString(squareFootage)).append("\n");
    sb.append("    bedrooms: ").append(toIndentedString(bedrooms)).append("\n");
    sb.append("    bathrooms: ").append(toIndentedString(bathrooms)).append("\n");
    sb.append("    yearBuilt: ").append(toIndentedString(yearBuilt)).append("\n");
    sb.append("    lotSize: ").append(toIndentedString(lotSize)).append("\n");
    sb.append("    distanceToCityCenter: ").append(toIndentedString(distanceToCityCenter)).append("\n");
    sb.append("    schoolRating: ").append(toIndentedString(schoolRating)).append("\n");
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
