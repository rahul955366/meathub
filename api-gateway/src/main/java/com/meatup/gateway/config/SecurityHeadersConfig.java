package com.meatup.gateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Adds security headers to all responses
 */
@Component
public class SecurityHeadersConfig extends AbstractGatewayFilterFactory<SecurityHeadersConfig.Config> {

    public SecurityHeadersConfig() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                var response = exchange.getResponse();
                HttpHeaders headers = response.getHeaders();
                
                // Security headers
                headers.add("X-Content-Type-Options", "nosniff");
                headers.add("X-Frame-Options", "DENY");
                headers.add("X-XSS-Protection", "1; mode=block");
                headers.add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                headers.add("Content-Security-Policy", "default-src 'self'");
                headers.add("Referrer-Policy", "strict-origin-when-cross-origin");
            }));
        };
    }

    public static class Config {
        // Configuration can be added here if needed
    }
}

