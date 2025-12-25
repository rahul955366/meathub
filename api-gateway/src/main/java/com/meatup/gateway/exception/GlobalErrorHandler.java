package com.meatup.gateway.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Slf4j
public class GlobalErrorHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Bean
    @Order(-2)
    public WebExceptionHandler globalExceptionHandler() {
        return (exchange, ex) -> {
            log.error("Unhandled exception in API Gateway", ex);

            exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("timestamp", LocalDateTime.now());
            errorResponse.put("status", 500);
            errorResponse.put("error", "Internal Server Error");
            errorResponse.put("message", "An unexpected error occurred");
            errorResponse.put("path", exchange.getRequest().getPath().value());

            try {
                String errorJson = objectMapper.writeValueAsString(errorResponse);
                return exchange.getResponse().writeWith(
                        Mono.just(exchange.getResponse().bufferFactory().wrap(errorJson.getBytes())));
            } catch (JsonProcessingException e) {
                log.error("Error serializing error response", e);
                return Mono.empty();
            }
        };
    }
}
