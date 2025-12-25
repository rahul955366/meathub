package com.meathub.order.config;

import com.meathub.order.security.JwtAuthenticationFilter;
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
                                // CORS is handled by API Gateway - no need to configure here
                                // Removing CORS config to avoid duplicate headers
                                .authorizeHttpRequests(auth -> auth
                                                // Cart endpoints - TEMPORARILY ALLOW ALL (for testing)
                                                .requestMatchers("/cart/**").permitAll()

                                                // Payment endpoints - USER role
                                                .requestMatchers("/payments/**").hasAuthority("ROLE_USER")

                                                // Review endpoints - GET is public, POST requires authentication
                                                .requestMatchers(HttpMethod.GET, "/reviews/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/reviews").hasAuthority("ROLE_USER")
                                                .requestMatchers(HttpMethod.POST, "/reviews/**")
                                                .hasAuthority("ROLE_USER")

                                                // Order placement and user orders - USER role
                                                .requestMatchers(HttpMethod.POST, "/orders/place")
                                                .hasAuthority("ROLE_USER")
                                                .requestMatchers(HttpMethod.GET, "/orders/my").hasAuthority("ROLE_USER")
                                                .requestMatchers(HttpMethod.PUT, "/orders/*/cancel")
                                                .hasAuthority("ROLE_USER")

                                                // Butcher orders - BUTCHER role
                                                .requestMatchers("/butcher/orders/**").hasAuthority("ROLE_BUTCHER")
                                                .requestMatchers(HttpMethod.PUT, "/orders/*/status")
                                                .hasAuthority("ROLE_BUTCHER")

                                                // Admin endpoints - ADMIN role
                                                .requestMatchers("/admin/orders/**").hasAuthority("ROLE_ADMIN")

                                                // All other endpoints require authentication
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
