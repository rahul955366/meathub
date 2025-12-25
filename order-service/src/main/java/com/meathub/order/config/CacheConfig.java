package com.meathub.order.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cache Configuration
 * For production, use Redis instead of in-memory cache
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        // In-memory cache for development
        // For production, use Redis:
        // RedisCacheManager.builder(redisConnectionFactory)
        //     .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
        //         .entryTtl(Duration.ofMinutes(10)))
        //     .build();
        return new ConcurrentMapCacheManager("orders", "cart", "reviews");
    }
}

