package com.meathub.order.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI meathubOrderServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MEATHUB Order Service API")
                        .description("Order Management Microservice API Documentation")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MEATHUB Support")
                                .email("support@meathub.com")
                                .url("https://meathub.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(List.of(
                        new Server().url("http://localhost:8000").description("API Gateway (Local)"),
                        new Server().url("http://localhost:8084").description("Order Service (Local)"),
                        new Server().url("https://api.meathub.com").description("Production API")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT token obtained from /auth/login endpoint")));
    }
}

