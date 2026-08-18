package com.propertyplayground.market.model;

public record MarketFilters(
        Long id,
        Integer bedrooms,
        Double bathrooms,
        Double minPrice,
        Double maxPrice,
        Double minSquareFootage,
        Double maxSquareFootage,
        Double minLotSize,
        Double maxLotSize,
        Integer minYearBuilt,
        Integer maxYearBuilt,
        Double minSchoolRating,
        Double maxSchoolRating,
        Double minDistance,
        Double maxDistance) {

    public static MarketFilters empty() {
        return new MarketFilters(
                null, null, null, null, null,
                null, null, null, null, null,
                null, null, null, null, null);
    }
}
