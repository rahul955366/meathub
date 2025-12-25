package com.meatup.gateway.filter;

import com.meatup.gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // Allow OPTIONS requests (CORS preflight) to pass through
            if (exchange.getRequest().getMethod() == org.springframework.http.HttpMethod.OPTIONS) {
                return chain.filter(exchange);
            }
            
            if (validator.test(exchange.getRequest())) {
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
                }

                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                } else {
                    return onError(exchange, "Invalid Authorization Header", HttpStatus.UNAUTHORIZED);
                }

                try {
                    jwtUtil.validateToken(authHeader);

                    // Extract info and add to headers for downstream services
                    String userId = jwtUtil.extractUserId(authHeader);
                    List<String> roles = jwtUtil.extractRoles(authHeader);

                    ServerHttpRequest request = exchange.getRequest()
                            .mutate()
                            .header("X-User-Id", userId)
                            // Passing roles can be tricky as list, simplest is comma separated or just let
                            // downstream re-validate
                            // For performance, Gateway usually validates, downstream might assume trust OR
                            // re-validate.
                            // In this architecture, we have stateless filters downstream that re-validate.
                            // So Gateway acts as the first line of defense.
                            .build();

                    return chain.filter(exchange.mutate().request(request).build());

                } catch (Exception e) {
                    return onError(exchange, "Invalid Token", HttpStatus.UNAUTHORIZED);
                }
            }
            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
        // Put configuration properties here
    }

    // Simple path validator to exclude auth endpoints and public endpoints
    private final RouteValidator validator = request -> {
        String path = request.getURI().getPath();
        // Public auth endpoints
        if (path.contains("/auth/register") || 
            path.contains("/auth/login") || 
            path.contains("/auth/refresh")) {
            return false;
        }
        // Public product endpoints (available items for marketplace)
        if (path.contains("/butchers/items/available") ||
            path.contains("/butchers/items/by-butcher/")) {
            return false;
        }
        // Public butcher endpoints (nearby butchers and butcher details)
        if (path.contains("/butchers/nearby")) {
            return false;
        }
        // Matches /butchers/{butcherId} - e.g., /butchers/1, /butchers/123
        if (path.startsWith("/butchers/") && path.substring(9).matches("\\d+$")) {
            return false;
        }
        // Public pet product browsing
        if (path.equals("/pet/products") || path.startsWith("/pet/products")) {
            return false;
        }
        // All other endpoints require authentication
        return true;
    };

    interface RouteValidator {
        boolean test(ServerHttpRequest request);
    }
}
