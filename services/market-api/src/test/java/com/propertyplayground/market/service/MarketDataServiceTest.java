package com.propertyplayground.market.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
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

        var summary = service.summarize(Optional.empty(), Optional.empty(), Optional.empty());

        assertThat(summary.count()).isEqualTo(50);
        assertThat(summary.minimumPrice()).isEqualTo(160000);
        assertThat(summary.maximumPrice()).isEqualTo(410000);
        assertThat(summary.segments()).hasSize(3);
    }
}
