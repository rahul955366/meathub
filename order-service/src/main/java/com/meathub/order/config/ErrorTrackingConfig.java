package com.meathub.order.config;

import org.springframework.context.annotation.Configuration;

/**
 * Error Tracking Configuration
 * For production, integrate with Sentry:
 * 
 * 1. Add dependency:
 *    <dependency>
 *        <groupId>io.sentry</groupId>
 *        <artifactId>sentry-spring-boot-starter</artifactId>
 *        <version>6.34.0</version>
 *    </dependency>
 * 
 * 2. Configure in application.properties:
 *    sentry.dsn=YOUR_SENTRY_DSN
 *    sentry.environment=production
 * 
 * 3. Sentry will automatically capture exceptions
 */
@Configuration
public class ErrorTrackingConfig {
    // Sentry auto-configuration will handle exception tracking
    // when dependency is added and DSN is configured
}

