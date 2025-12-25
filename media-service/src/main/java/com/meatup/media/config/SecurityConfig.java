package com.meatup.media.config;

import com.meatup.media.security.JwtAuthenticationFilter;
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
                        // Upload - BUTCHER and ADMIN
                        .requestMatchers(HttpMethod.POST, "/media/upload").hasAnyAuthority("ROLE_BUTCHER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/media/upload/**").hasAnyAuthority("ROLE_BUTCHER", "ROLE_ADMIN")

                        // Admin operations
                        .requestMatchers("/admin/media/**").hasAuthority("ROLE_ADMIN")

                        // View operations - accessible to users, but service may filter
                        // Realistically, Order media should be guarded, but controller logic will
                        // handle detail ownership check if needed
                        // For simplicity, authenticated users can view media if they have the ID
                        .requestMatchers(HttpMethod.GET, "/media/**").authenticated()

                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
