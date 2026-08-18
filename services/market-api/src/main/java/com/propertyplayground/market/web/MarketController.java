package com.propertyplayground.market.web;

import com.propertyplayground.market.model.MarketSummary;
import com.propertyplayground.contracts.HousingFeatures;
import com.propertyplayground.contracts.PredictionResponse;
import com.propertyplayground.market.model.PropertyRecord;
import com.propertyplayground.market.service.ExportService;
import com.propertyplayground.market.service.MarketDataService;
import com.propertyplayground.market.service.ModelClient;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/market")
public class MarketController {
    private final MarketDataService marketData;
    private final ModelClient modelClient;
    private final ExportService exportService;

    public MarketController(MarketDataService marketData, ModelClient modelClient, ExportService exportService) {
        this.marketData = marketData;
        this.modelClient = modelClient;
        this.exportService = exportService;
    }

    @GetMapping("/summary")
    public MarketSummary summary(
            @RequestParam Optional<Integer> bedrooms,
            @RequestParam Optional<Double> minPrice,
            @RequestParam Optional<Double> maxPrice) {
        return marketData.summarize(bedrooms, minPrice, maxPrice);
    }

    @GetMapping("/properties")
    public List<PropertyRecord> properties(
            @RequestParam Optional<Integer> bedrooms,
            @RequestParam Optional<Double> minPrice,
            @RequestParam Optional<Double> maxPrice) {
        return marketData.filter(bedrooms, minPrice, maxPrice);
    }

    @PostMapping("/what-if")
    public PredictionResponse whatIf(@Valid @RequestBody HousingFeatures request) {
        return modelClient.predict(request);
    }

    @GetMapping(value = "/export/csv", produces = "text/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam Optional<Integer> bedrooms,
            @RequestParam Optional<Double> minPrice,
            @RequestParam Optional<Double> maxPrice) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=property-market.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(exportService.toCsv(marketData.filter(bedrooms, minPrice, maxPrice)));
    }

    @GetMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam Optional<Integer> bedrooms,
            @RequestParam Optional<Double> minPrice,
            @RequestParam Optional<Double> maxPrice) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=property-market.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(exportService.toPdf(marketData.filter(bedrooms, minPrice, maxPrice)));
    }
}
