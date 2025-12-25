package com.meatup.ai.config;

import com.meatup.ai.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(request -> {
                                        CorsConfiguration config = new CorsConfiguration();
                                        config.setAllowedOriginPatterns(Arrays.asList("*"));
                                        config.setAllowedMethods(
                                                        Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                                        config.setAllowedHeaders(Arrays.asList("*"));
                                        config.setAllowCredentials(false);
                                        return config;
                                }))
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(auth -> auth
                                                // AI chat endpoints are publicly accessible
                                                .requestMatchers("/ai/**").permitAll()
                                                // All other endpoints require authentication
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setStatus(401);
                                                        response.setContentType("application/json");
                                                        response.getWriter()
                                                                        .write("{\"error\":\"Unauthorized\",\"message\":\"Please login to use AI chat\"}");
                                                }));

                return http.build();
        }
}
