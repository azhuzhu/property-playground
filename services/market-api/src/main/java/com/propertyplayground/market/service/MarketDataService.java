package com.propertyplayground.market.service;

import com.propertyplayground.market.model.MarketFilters;
import com.propertyplayground.market.model.MarketSummary;
import com.propertyplayground.market.model.PropertyRecord;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class MarketDataService {
    private final Path datasetPath;
    private List<PropertyRecord> properties = List.of();

    public MarketDataService(@Value("${market.dataset-path}") String datasetPath) {
        this.datasetPath = Path.of(datasetPath);
    }

    @PostConstruct
    void loadDataset() throws IOException {
        List<String> lines = Files.readAllLines(datasetPath);
        List<PropertyRecord> loaded = new ArrayList<>();
        for (int index = 1; index < lines.size(); index++) {
            String[] values = lines.get(index).split(",");
            if (values.length != 9) {
                continue;
            }
            loaded.add(new PropertyRecord(
                    Long.parseLong(values[0]), Double.parseDouble(values[1]),
                    Double.parseDouble(values[2]), Double.parseDouble(values[3]),
                    Integer.parseInt(values[4]), Double.parseDouble(values[5]),
                    Double.parseDouble(values[6]), Double.parseDouble(values[7]),
                    Double.parseDouble(values[8])));
        }
        properties = List.copyOf(loaded);
    }

    @Cacheable("property-lists")
    public List<PropertyRecord> filter(MarketFilters filters) {
        return properties.stream()
                .filter(item -> filters.id() == null || item.id() == filters.id())
                .filter(item -> filters.bedrooms() == null || item.bedrooms() == filters.bedrooms())
                .filter(item -> filters.bathrooms() == null || item.bathrooms() == filters.bathrooms())
                .filter(item -> filters.minPrice() == null || item.price() >= filters.minPrice())
                .filter(item -> filters.maxPrice() == null || item.price() <= filters.maxPrice())
                .filter(item -> filters.minSquareFootage() == null
                        || item.squareFootage() >= filters.minSquareFootage())
                .filter(item -> filters.maxSquareFootage() == null
                        || item.squareFootage() <= filters.maxSquareFootage())
                .filter(item -> filters.minLotSize() == null || item.lotSize() >= filters.minLotSize())
                .filter(item -> filters.maxLotSize() == null || item.lotSize() <= filters.maxLotSize())
                .filter(item -> filters.minYearBuilt() == null || item.yearBuilt() >= filters.minYearBuilt())
                .filter(item -> filters.maxYearBuilt() == null || item.yearBuilt() <= filters.maxYearBuilt())
                .filter(item -> filters.minSchoolRating() == null
                        || item.schoolRating() >= filters.minSchoolRating())
                .filter(item -> filters.maxSchoolRating() == null
                        || item.schoolRating() <= filters.maxSchoolRating())
                .filter(item -> filters.minDistance() == null
                        || item.distanceToCityCenter() >= filters.minDistance())
                .filter(item -> filters.maxDistance() == null
                        || item.distanceToCityCenter() <= filters.maxDistance())
                .toList();
    }

    @Cacheable("market-summaries")
    public MarketSummary summarize(MarketFilters filters) {
        List<PropertyRecord> filtered = filter(filters);
        if (filtered.isEmpty()) {
            return new MarketSummary(0, 0, 0, 0, 0, 0, List.of());
        }
        List<Double> prices = filtered.stream().map(PropertyRecord::price).sorted().toList();
        int middle = prices.size() / 2;
        double median = prices.size() % 2 == 0
                ? (prices.get(middle - 1) + prices.get(middle)) / 2
                : prices.get(middle);
        Map<Double, List<PropertyRecord>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(PropertyRecord::bedrooms));
        List<MarketSummary.BedroomSegment> segments = grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new MarketSummary.BedroomSegment(
                        entry.getKey(), entry.getValue().size(),
                        entry.getValue().stream().mapToDouble(PropertyRecord::price).average().orElse(0)))
                .toList();
        return new MarketSummary(
                filtered.size(),
                filtered.stream().mapToDouble(PropertyRecord::price).average().orElse(0),
                median,
                filtered.stream().min(Comparator.comparingDouble(PropertyRecord::price)).orElseThrow().price(),
                filtered.stream().max(Comparator.comparingDouble(PropertyRecord::price)).orElseThrow().price(),
                filtered.stream().mapToDouble(PropertyRecord::squareFootage).average().orElse(0),
                segments);
    }
}
