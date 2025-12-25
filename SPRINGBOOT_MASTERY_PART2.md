# 🎓 Spring Boot Mastery - Part 2 (Advanced Topics)

**Alright my friend, let's dive into the ADVANCED stuff!** 🚀

---

## 🔐 **Chapter 7: Security (JWT Authentication)**

### The Problem:
How do we know WHO is making requests to our API?

### The Solution: JWT (JSON Web Tokens)

**How it works:**
1. User logs in → Get JWT token
2. User includes token in requests → "Authorization: Bearer xyz..."
3. Server verifies token → Allow/Deny

### Real Implementation (From YOUR Project!):

**Step 1: Dependencies**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
```

**Step 2: JWT Utility (Generate & Validate Tokens)**
```java
@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secretKey;
    
    public String generateToken(String username, String role) {
        return Jwts.builder()
            .setSubject(username)
            .claim("role", role)  // Add role to token
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))  // 24 hours
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }
    
    public String extractUsername(String token) {
        return Jwts.parser()
            .setSigningKey(secretKey)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

**Step 3: Security Configuration**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf().disable()  // Disable CSRF for REST APIs
            .authorizeRequests()
                .antMatchers("/auth/**").permitAll()  // Public endpoints
                .antMatchers("/api/admin/**").hasRole("ADMIN")  // Admin only
                .anyRequest().authenticated()  // Everything else needs auth
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // No sessions!
            .and()
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Step 4: JWT Filter (Intercept Every Request)**
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);
                
                // Set authentication in Spring Security context
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        
        filterChain.doFilter(request, response);  // Continue to next filter
    }
}
```

**Step 5: Login Controller**
```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Authenticate user
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        
        // Generate token
        User user = userService.findByEmail(request.getEmail());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        
        return new LoginResponse(token, user);
    }
}
```

**How to Use:**
```bash
# 1. Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'

# Response: {"token":"eyJhbGc...","user":{...}}

# 2. Use token in requests
curl http://localhost:8080/api/products \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 📊 **Chapter 8: Spring Data JPA (Database Magic!)**

### Relationships (The Tricky Part!)

**1. One-to-Many (User has many Orders)**
```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;  // One user, many orders
}

@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  // Many orders, one user
}
```

**2. Many-to-Many (Products and Categories)**
```java
@Entity
public class Product {
    @Id
    private Long id;
    
    @ManyToMany
    @JoinTable(
        name = "product_category",  // Join table
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;
}

@Entity
public class Category {
    @Id
    private Long id;
    
    @ManyToMany(mappedBy = "categories")
    private Set<Product> products;
}
```

### Custom Queries (Repository Methods)

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Method name becomes query! (Spring magic!)
    List<Product> findByName(String name);
    List<Product> findByPriceLessThan(Double price);
    List<Product> findByNameContaining(String keyword);
    List<Product> findByCategoryAndPriceLessThan(String category, Double price);
    
    // Custom JPQL
    @Query("SELECT p FROM Product p WHERE p.stock > 0")
    List<Product> findInStock();
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    List<Product> findInPriceRange(@Param("min") Double min, @Param("max") Double max);
    
    // Native SQL
    @Query(value = "SELECT * FROM products WHERE stock < :threshold", nativeQuery = true)
    List<Product> findLowStock(@Param("threshold") Integer threshold);
    
    // Updates
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock + :quantity WHERE p.id = :id")
    void addStock(@Param("id") Long id, @Param("quantity") Integer quantity);
}
```

**Usage:**
```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;
    
    public void examples() {
        // All these work automatically!
        repo.findByName("Chicken");
        repo.findByPriceLessThan(500.0);
        repo.findByNameContaining("chick");
        repo.findInStock();
        repo.findInPriceRange(100.0, 500.0);
        repo.addStock(1L, 10);
    }
}
```

---

## 🧪 **Chapter 9: Testing (Important for Interviews!)**

### Unit Testing (Service Layer)

```java
@SpringBootTest
class ProductServiceTest {
    
    @Autowired
    private ProductService service;
    
    @MockBean  // Mock the repository
    private ProductRepository repository;
    
    @Test
    void testGetAllProducts() {
        // Arrange
        List<Product> mockProducts = Arrays.asList(
            new Product(1L, "Chicken", 299.0),
            new Product(2L, "Mutton", 599.0)
        );
        when(repository.findAll()).thenReturn(mockProducts);
        
        // Act
        List<Product> result = service.getAllProducts();
        
        // Assert
        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }
    
    @Test
    void testCreateProduct_InvalidPrice() {
        // Test exception handling
        Product product = new Product();
        product.setPrice(-100.0);  // Invalid!
        
        assertThrows(IllegalArgumentException.class, () -> {
            service.createProduct(product);
        });
    }
}
```

### Integration Testing (Controller Layer)

```java
@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetAllProducts() throws Exception {
        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].name").value("Chicken"));
    }
    
    @Test
    void testCreateProduct() throws Exception {
        String productJson = "{\"name\":\"Fish\",\"price\":499.0}";
        
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Fish"));
    }
}
```

---

## 🌐 **Chapter 10: Microservices with Spring Cloud**

**Your Project Uses This! Let's understand it:**

### 1. **API Gateway** (Entry Point)

```java
@SpringBootApplication
@EnableGatewayServer  // Turns this into a gateway
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

**application.yml:**
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/auth/**
            
        - id: user-service
          uri: http://localhost:8082
          predicates:
            - Path=/users/**
          filters:
            - JwtAuthenticationFilter
```

**What happens:**
- Request to `/auth/login` → Routes to Auth Service (8081)
- Request to `/users/profile` → Routes to User Service (8082) + JWT check

### 2. **Service Communication (RestTemplate vs WebClient)**

**RestTemplate (Simple):**
```java
@Service
public class OrderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUserDetails(Long userId) {
        String url = "http://user-service/users/" + userId;
        return restTemplate.getForObject(url, User.class);
    }
}
```

**WebClient (Reactive, Better):**
```java
@Service
public class OrderService {
    
    private final WebClient webClient;
    
    public OrderService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://user-service").build();
    }
    
    public Mono<User> getUserDetails(Long userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(User.class);
    }
}
```

### 3. **Circuit Breaker (Resilience4j)**

**From YOUR API Gateway!**

```java
@Configuration
public class ResilienceConfig {
    @Bean
    public Customizer<ReactiveResilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> factory.configureDefault(id -> 
            new Resilience4JConfigBuilder(id)
                .circuitBreakerConfig(CircuitBreakerConfig.custom()
                    .failureRateThreshold(50)  // Open if 50% fail
                    .waitDurationInOpenState(Duration.ofMillis(10000))  // Wait 10s
                    .build())
                .timeLimiterConfig(TimeLimiterConfig.custom()
                    .timeoutDuration(Duration.ofSeconds(5))  // 5s timeout
                    .build())
                .build()
        );
    }
}
```

**What it does:**
- Service down? Circuit opens → Fallback response 
- Prevents cascade failures
- Retries automatically

---

## 🎯 **Chapter 11: Real-World Patterns (From YOUR Project!)**

### Pattern 1: Service Layer Structure

```
Controller → Service → Repository → Database

ProductController
    ↓ (calls)
ProductService
    ↓ (uses)
ProductRepository
    ↓ (queries)
MySQL Database
```

**Why?**
- **Controller**: Handle HTTP (request/response)
- **Service**: Business logic (validations, calculations)
- **Repository**: Database access only

**Example from YOUR pet-service:**
```java
// Controller - HTTP handling
@RestController
@RequestMapping("/pet")
public class PetController {
    @Autowired
    private PetService service;
    
    @PostMapping("/subscribe")
    public PetSubscription subscribe(@RequestBody PetSubscriptionRequest request) {
        return service.createSubscription(request);  // Delegate to service
    }
}

// Service - Business logic
@Service
public class PetService {
    @Autowired
    private PetRepository repository;
    
    @Autowired
    private UserService userService;  // Call other services
    
    public PetSubscription createSubscription(PetSubscriptionRequest request) {
        // 1. Validate
        validateRequest(request);
        
        // 2. Check user
        User user = userService.getCurrentUser();
        
        // 3. Business logic
        PetSubscription subscription = buildSubscription(request, user);
        
        // 4. Save
        return repository.save(subscription);
    }
}

// Repository - Database only
@Repository
public interface PetRepository extends JpaRepository<PetSubscription, Long> {
    List<PetSubscription> findByUserId(Long userId);
}
```

### Pattern 2: DTO (Data Transfer Objects)

**Problem:** Don't expose entity directly!

**Bad:**
```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userRepository.findById(id);  // ❌ Exposes password, internal fields!
}
```

**Good:**
```java
@GetMapping("/users/{id}")
public UserDTO getUser(@PathVariable Long id) {
    User user = userRepository.findById(id);
    return new UserDTO(user);  // ✅ Only expose what's needed
}

public class UserDTO {
    private String name;
    private String email;
    // NO password, NO internal IDs
}
```

### Pattern 3: Global Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(
            new ErrorResponse(404, ex.getMessage(), LocalDateTime.now())
        );
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        return ResponseEntity.status(400).body(
            new ErrorResponse(400, ex.getMessage(), LocalDateTime.now())
        );
    }
}
```

---

## 🚀 **Chapter 12: Spring Boot Best Practices**

### 1. **Use Profiles**
```properties
# application-dev.properties
spring.datasource.url=jdbc:mysql://localhost:3306/dev_db
logging.level.root=DEBUG

# application-prod.properties
spring.datasource.url=jdbc:mysql://prod-server:3306/prod_db
logging.level.root=ERROR
```

Run: `java -jar app.jar --spring.profiles.active=prod`

### 2. **Externalize Configuration**
```properties
# application.properties
app.name=MEATHUB
app.api.key=${API_KEY:default-key}  # From environment variable
```

### 3. **Use Lombok**
```java
// Instead of 50 lines of getters/setters:
@Data  // Generates everything!
@Entity
public class Product {
    @Id
    private Long id;
    private String name;
    private Double price;
}
```

### 4. **Pagination**
```java
@GetMapping
public Page<Product> getAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size);
    return repository.findAll(pageable);
}
```

### 5. **Async Processing**
```java
@Service
public class EmailService {
    
    @Async  // Runs in separate thread!
    public CompletableFuture<Void> sendEmail(String to, String body) {
        // Send email (takes time)
        emailClient.send(to, body);
        return CompletableFuture.completedFuture(null);
    }
}
```

---

## 🎓 **Final Boss: Interview Questions**

### Q1: What is Spring Boot and how is it different from Spring?
**Answer:** Spring Boot is an extension of Spring Framework that provides auto-configuration, embedded servers, and starter dependencies. It eliminates most boilerplate configuration, making it faster to develop production-ready applications.

### Q2: Explain Dependency Injection
**Answer:** DI is a design pattern where objects receive their dependencies from external sources rather than creating them. Spring manages object lifecycle and injects dependencies automatically using @Autowired.

### Q3: What is the difference between @Component, @Service, @Repository, and @Controller?
**Answer:** All are stereotypes that mark classes as Spring beans. @Repository adds persistence exception translation, @Controller indicates it handles web requests, @Service marks business logic layer, @Component is generic.

### Q4: How does Spring Boot auto-configuration work?
**Answer:** Spring Boot scans classpath for libraries, reads application.properties, and automatically configures beans based on conditions using @Conditional annotations.

### Q5: Explain the architecture of a Spring Boot microservice
**Answer:** API Gateway → Service Discovery → Individual services (each with Controller → Service → Repository layers) → Database per service. Services communicate via REST/gRPC.

---

## 🎯 **YOU'RE READY!**

You now understand:
✅ Spring Boot fundamentals  
✅ Building REST APIs  
✅ Database with JPA  
✅ Security with JWT  
✅ Microservices architecture  
✅ Testing  
✅ Best practices  

**Your MEATHUB project uses ALL of this!** Now you can explain every single line! 💪

**Go ace that exam, buddy!** 🚀

Questions? Read through again! Everything you need is here! 📚
