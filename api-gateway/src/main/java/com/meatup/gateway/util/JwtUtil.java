package com.meatup.gateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

import java.util.List;
import java.util.function.Function;

@Component
public class JwtUtil {

    // Must match the secret used in Auth Service
    @Value("${jwt.secret}")
    private String jwtSecret;

    public void validateToken(String token) {
        Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token);
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> {
            Object userIdObj = claims.get("userId");
            // Handle potentially different number types from JWT parsing
            if (userIdObj instanceof Integer) {
                return String.valueOf(userIdObj);
            }
            return String.valueOf(userIdObj);
        });
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> (List<String>) claims.get("roles", List.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
