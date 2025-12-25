# 500 Internal Server Error Fixes

## Issues Identified

You were experiencing 500 Internal Server Errors on:
1. `/reviews/meat-item/6` and `/reviews/meat-item/16` - Review endpoints
2. `/ai/chat` - AI chat endpoint

## Root Cause

Both services were configured to require authentication for **ALL endpoints**, including GET requests that should be publicly accessible. When unauthenticated users tried to view reviews or use the AI chat, the services attempted to get the current user ID from the security context, which didn't exist, causing a 500 error.

## Fixes Applied

### 1. Order Service - Review Endpoints
**File:** `order-service/src/main/java/com/meathub/order/config/SecurityConfig.java`

**Changed:**
```java
// Before: All review endpoints required authentication
.requestMatchers("/reviews/**").hasAuthority("ROLE_USER")

// After: GET requests are public, POST requires authentication
.requestMatchers(HttpMethod.GET, "/reviews/**").permitAll()
.requestMatchers(HttpMethod.POST, "/reviews").hasAuthority("ROLE_USER")
.requestMatchers(HttpMethod.POST, "/reviews/**").hasAuthority("ROLE_USER")
```

**Rationale:** Anyone should be able to view product reviews without logging in. Only creating reviews should require authentication.

### 2. AI Service - Chat Endpoints
**File:** `ai-service/src/main/java/com/meatup/ai/config/SecurityConfig.java`

**Changed:**
```java
// Before: All endpoints required authentication  
.anyRequest().authenticated()

// After: AI endpoints are publicly accessible
.requestMatchers("/ai/**").permitAll()
.anyRequest().authenticated()
```

**File:** `ai-service/src/main/java/com/meatup/ai/service/AiChatService.java`

**Changed:** Updated `getCurrentUserId()` method to return `null` for guest users instead of throwing an exception:
```java
private Long getCurrentUserId() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
        return null; // Guest user
    }
    if (!(auth.getPrincipal() instanceof UserPrincipal)) {
        return null; // Invalid auth principal
    }
    UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
    return userPrincipal.getUserId();
}
```

**Rationale:** Allows both authenticated and guest users to use the AI assistant.

## Next Steps

### To Apply These Fixes:

1. **Rebuild the services:**
   ```bash
   # AI Service (already compiled successfully)
   cd ai-service
   mvn package -DskipTests
   
   #Order Service (has compilation issues to fix first)
   cd order-service
   # Fix compilation error in OrderService.java first, then:
   mvn package -DskipTests
   ```

2. **Restart the services:**
   - Stop the running `order-service` and `ai-service` instances
   - Start them again with the newly compiled JARs

3. **Test the fixes:**
   - Try accessing `/reviews/meat-item/6` without authentication
   - Try using the AI chat without logging in
   - Both should now work without 500 errors

## Additional Notes

- The **order-service** has a compilation error unrelated to our security changes that needs to be fixed first
- The **ai-service** compiled successfully and is ready to deploy
- Once both services are restarted with the new configuration, the 500 errors should be resolved

## Files Modified

1. `c:\Users\sango\OneDrive\Desktop\myProject_MEAT\order-service\src\main\java\com\meathub\order\config\SecurityConfig.java`
2. `c:\Users\sango\OneDrive\Desktop\myProject_MEAT\ai-service\src\main\java\com\meatup\ai\config\SecurityConfig.java`
3. `c:\Users\sango\OneDrive\Desktop\myProject_MEAT\ai-service\src\main\java\com\meatup\ai\service\AiChatService.java`
