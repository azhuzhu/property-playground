package com.propertyplayground.market;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@EnableCaching
@SpringBootApplication
public class MarketApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(MarketApiApplication.class, args);
    }

    @Bean
    RestClient modelRestClient(RestClient.Builder builder) {
        return builder.requestFactory(new SimpleClientHttpRequestFactory()).build();
    }
}
