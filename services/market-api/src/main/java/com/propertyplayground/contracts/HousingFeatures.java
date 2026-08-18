package com.propertyplayground.contracts;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

// Generated from contracts/housing.schema.json by scripts/generate_contracts.py.
public record HousingFeatures(
        @Positive @JsonProperty("square_footage") double squareFootage,
        @DecimalMin("0") @DecimalMax("20") double bedrooms,
        @DecimalMin("0") @DecimalMax("20") double bathrooms,
        @Min(1700) @Max(2200) @JsonProperty("year_built") int yearBuilt,
        @Positive @JsonProperty("lot_size") double lotSize,
        @DecimalMin("0") @JsonProperty("distance_to_city_center") double distanceToCityCenter,
        @DecimalMin("0") @DecimalMax("10") @JsonProperty("school_rating") double schoolRating) {
}
