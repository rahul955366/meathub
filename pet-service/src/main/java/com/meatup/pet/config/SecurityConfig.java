package com.meatup.pet.config;

import com.meatup.pet.security.JwtAuthenticationFilter;
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
                        // Public endpoints - Product browsing
                        .requestMatchers(HttpMethod.GET, "/pet/products").permitAll()
                        
                        // User endpoints - USER role
                        .requestMatchers(HttpMethod.POST, "/pet/subscribe").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.GET, "/pet/my").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.PUT, "/pet/*/pause").hasAuthority("ROLE_USER")
                        .requestMatchers(HttpMethod.PUT, "/pet/*/resume").hasAuthority("ROLE_USER")

                        // Butcher endpoints - BUTCHER role
                        .requestMatchers(HttpMethod.POST, "/pet/products").hasAuthority("ROLE_BUTCHER")
                        .requestMatchers(HttpMethod.PUT, "/pet/products/*").hasAuthority("ROLE_BUTCHER")
                        .requestMatchers(HttpMethod.GET, "/pet/products/my").hasAuthority("ROLE_BUTCHER")

                        // Admin endpoints - ADMIN role
                        .requestMatchers("/admin/pet/**").hasAuthority("ROLE_ADMIN")

                        // All other endpoints require authentication
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
