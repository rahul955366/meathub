package com.meatup.subscription.config;

import com.meatup.subscription.security.JwtAuthenticationFilter;
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
                        // User subscription endpoints - USER role
                        .requestMatchers(HttpMethod.POST, "/subscriptions").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.GET, "/subscriptions/my").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.PUT, "/subscriptions/*/pause").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.PUT, "/subscriptions/*/resume").hasAuthority("ROLE_USER")

                        // Butcher endpoints - BUTCHER role
                        .requestMatchers("/butcher/subscriptions/**").hasAuthority("ROLE_BUTCHER")

                        // Admin endpoints - ADMIN role
                        .requestMatchers("/admin/subscriptions/**").hasAuthority("ROLE_ADMIN")

                        // All other endpoints require authentication
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
