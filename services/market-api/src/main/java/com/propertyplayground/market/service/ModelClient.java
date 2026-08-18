package com.propertyplayground.market.service;

import com.propertyplayground.contracts.HousingFeatures;
import com.propertyplayground.contracts.PredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class ModelClient {
    private final RestClient restClient;
    private final String modelApiUrl;

    public ModelClient(RestClient modelRestClient, @Value("${model.api-url}") String modelApiUrl) {
        this.restClient = modelRestClient;
        this.modelApiUrl = modelApiUrl;
    }

    public PredictionResponse predict(HousingFeatures request) {
        try {
            PredictionResponse response = restClient.post()
                    .uri(modelApiUrl + "/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(PredictionResponse.class);
            if (response == null) {
                throw new ModelUnavailableException("Prediction model returned an empty response");
            }
            return response;
        } catch (RestClientException exception) {
            throw new ModelUnavailableException("Prediction model is unavailable", exception);
        }
    }
}
