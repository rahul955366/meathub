package com.meatup.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting
 */
@Component
public class RateLimitFilter extends AbstractGatewayFilterFactory<RateLimitFilter.Config> {

    private final Map<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();
    private static final int DEFAULT_REQUESTS_PER_MINUTE = 60;

    public RateLimitFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String clientId = getClientId(exchange);
            int limit = config.getRequestsPerMinute() > 0 
                ? config.getRequestsPerMinute() 
                : DEFAULT_REQUESTS_PER_MINUTE;

            if (isRateLimited(clientId, limit)) {
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                DataBuffer buffer = response.bufferFactory().wrap("Rate limit exceeded".getBytes());
                return response.writeWith(Mono.just(buffer));
            }

            return chain.filter(exchange);
        };
    }

    private String getClientId(ServerWebExchange exchange) {
        // Use IP address as client identifier
        String ip = exchange.getRequest().getRemoteAddress() != null
            ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
            : "unknown";
        return ip;
    }

    private boolean isRateLimited(String clientId, int limit) {
        RateLimitInfo info = rateLimitMap.computeIfAbsent(clientId, k -> new RateLimitInfo());
        
        long now = System.currentTimeMillis();
        if (now - info.getWindowStart() > Duration.ofMinutes(1).toMillis()) {
            // Reset window
            info.setWindowStart(now);
            info.setRequestCount(1);
            return false;
        }

        if (info.getRequestCount() >= limit) {
            return true;
        }

        info.incrementRequestCount();
        return false;
    }

    private static class RateLimitInfo {
        private long windowStart = System.currentTimeMillis();
        private int requestCount = 0;

        public long getWindowStart() { return windowStart; }
        public void setWindowStart(long windowStart) { this.windowStart = windowStart; }
        public int getRequestCount() { return requestCount; }
        public void setRequestCount(int requestCount) { this.requestCount = requestCount; }
        public void incrementRequestCount() { this.requestCount++; }
    }

    public static class Config {
        private int requestsPerMinute = DEFAULT_REQUESTS_PER_MINUTE;
        public int getRequestsPerMinute() { return requestsPerMinute; }
        public void setRequestsPerMinute(int requestsPerMinute) { this.requestsPerMinute = requestsPerMinute; }
    }
}

