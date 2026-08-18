package com.propertyplayground.market.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.propertyplayground.market.model.MarketFilters;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class MarketDataServiceTest {
    @Test
    void calculatesMarketSummaryFromDataset() throws Exception {
        Path dataset = Path.of("data/House Price Dataset.csv");
        if (!Files.exists(dataset)) {
            dataset = Path.of("../../data/House Price Dataset.csv");
        }
        MarketDataService service = new MarketDataService(dataset.toString());
        service.loadDataset();

        var summary = service.summarize(MarketFilters.empty());

        assertThat(summary.count()).isEqualTo(50);
        assertThat(summary.minimumPrice()).isEqualTo(160000);
        assertThat(summary.maximumPrice()).isEqualTo(410000);
        assertThat(summary.segments()).hasSize(3);
    }

    @Test
    void filtersAcrossEveryPropertyField() throws Exception {
        Path dataset = Path.of("data/House Price Dataset.csv");
        if (!Files.exists(dataset)) {
            dataset = Path.of("../../data/House Price Dataset.csv");
        }
        MarketDataService service = new MarketDataService(dataset.toString());
        service.loadDataset();

        var filters = new MarketFilters(
                1L, 2, 1.0, 180000.0, 190000.0,
                1200.0, 1300.0, 5000.0, 5400.0, 1980,
                1990, 7.0, 7.2, 3.0, 3.5);

        assertThat(service.filter(filters)).singleElement()
                .satisfies(property -> assertThat(property.id()).isEqualTo(1));
    }
}
