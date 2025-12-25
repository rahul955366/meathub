package com.meatup.delivery.config;

import com.meatup.delivery.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Admin endpoints - ADMIN role
                        .requestMatchers(HttpMethod.POST, "/agents").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/agents").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/deliveries/assign").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/deliveries").hasAuthority("ROLE_ADMIN")

                        // Agent endpoints - DELIVERY_AGENT role (will use USER role for now)
                        .requestMatchers(HttpMethod.GET, "/agent/deliveries").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/deliveries/*/status").authenticated()

                        // User endpoints - any authenticated user
                        .requestMatchers(HttpMethod.GET, "/deliveries/order/*").authenticated()

                        // All other endpoints require authentication
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
