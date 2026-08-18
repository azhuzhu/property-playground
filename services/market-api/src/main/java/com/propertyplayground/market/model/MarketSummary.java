package com.propertyplayground.market.model;

import java.util.List;

public record MarketSummary(
        long count,
        double averagePrice,
        double medianPrice,
        double minimumPrice,
        double maximumPrice,
        double averageSquareFootage,
        List<BedroomSegment> segments) {
    public record BedroomSegment(double bedrooms, long count, double averagePrice) {
    }
}
