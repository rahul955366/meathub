package com.meathub.order.config;

import org.springframework.context.annotation.Configuration;

/**
 * Centralized Logging Configuration
 * For production, integrate with ELK stack or CloudWatch
 * 
 * Logging is configured via logback-spring.xml
 * This class serves as documentation for logging setup
 */
@Configuration
public class LoggingConfig {
    // Logging configuration is handled by logback-spring.xml
    // For ELK stack integration, add logstash-logback-encoder dependency
    // and configure JSON appender in logback-spring.xml
}

