package com.meatup.gateway.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    /**
     * CORS Configuration is handled in application.yml via globalcors
     * Routes are configured in application.yml
     * This class is kept for future extensibility
     */

    /*
     * Alternative to application.yml configuration.
     * Often mixing Java and YAML config can be confusing.
     * Since we defined routes in application.yml, we technically don't need this
     * Java DSL,
     * UNLESS we want to apply the custom filter explicitly to specific routes
     * easily.
     * 
     * However, in Spring Cloud Gateway, it's cleaner to use `default-filters` in
     * YAML
     * or apply specific filters in YAML.
     * 
     * To ensure our JwtAuthenticationFilter logic runs, we either register it as a
     * GlobalFilter
     * or apply it in YAML.
     * The `JwtAuthenticationFilter` extends `AbstractGatewayFilterFactory`, which
     * means it is
     * a specific filter, not global. It must be applied in YAML or via Java DSL.
     * 
     * I will update the application.yml to include this filter on secured routes.
     * Retaining this class for future extensibility but leaving it empty of routes
     * for now.
     */
}
