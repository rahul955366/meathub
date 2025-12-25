# 🎯 Spring Boot - Quick Reference Card (Exam Cheat Sheet!)

## 📌 **The Big 5 Annotations**

```java
@SpringBootApplication  // Main class - does EVERYTHING
@RestController        // REST API endpoints
@Service              // Business logic layer
@Repository           // Database layer (extends JpaRepository)
@Entity               // Database table (with @Id, @Column)
```

---

## 🔥 **Most Common Annotations**

| Annotation | Purpose | Example |
|------------|---------|---------|
| `@Autowired` | Inject dependency | `@Autowired private UserService service;` |
| `@GetMapping` | Handle GET request | `@GetMapping("/users")` |
| `@PostMapping` | Handle POST request | `@PostMapping("/users")` |
| `@PathVariable` | Get URL parameter | `@GetMapping("/{id}")` |
| `@RequestBody` | Get request body | `@PostMapping public User create(@RequestBody User user)` |
| `@RequestParam` | Get query parameter | `@GetMapping public List<User> search(@RequestParam String name)` |
| `@Valid` | Trigger validation | `public User create(@Valid @RequestBody User user)` |
| `@Transactional` | Database transaction | `@Transactional public void updateUser()` |

---

## 🏗️ **Project Structure (Remember This!)**

```
src/main/java/com/company/project/
├── Application.java          (@SpringBootApplication)
├── controller/               (@RestController)
│   └── UserController.java
├── service/                  (@Service)
│   └── UserService.java
├── repository/               (@Repository)
│   └── UserRepository.java
├── model/                    (@Entity)
│   └── User.java
├── config/                   (@Configuration)
│   └── SecurityConfig.java
└── dto/                      (Plain classes)
    └── UserDTO.java

src/main/resources/
├── application.properties    (Configuration)
└── data.sql                  (Initial data)
```

---

## 📝 **Essential application.properties**

```properties
# Server
server.port=8080

# Database (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update  # create, update, validate, none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.company.project=DEBUG
```

---

## 🎯 **REST API Patterns**

### CRUD Operations:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService service;
    
    @GetMapping                          // GET /api/users
    public List<User> getAll() { }
    
    @GetMapping("/{id}")                // GET /api/users/123
    public User getOne(@PathVariable Long id) { }
    
    @PostMapping                         // POST /api/users
    public User create(@RequestBody User user) { }
    
    @PutMapping("/{id}")                // PUT /api/users/123
    public User update(@PathVariable Long id, @RequestBody User user) { }
    
    @DeleteMapping("/{id}")             // DELETE /api/users/123
    public void delete(@PathVariable Long id) { }
}
```

---

## 🗄️ **JPA Repository Magic**

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Method names become queries!
    
    User findByEmail(String email);
    List<User> findByNameContaining(String keyword);
    List<User> findByAgeGreaterThan(Integer age);
    List<User> findByNameAndAge(String name, Integer age);
    
    // Custom query
    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findUserByEmail(@Param("email") String email);
    
    // Native SQL
    @Query(value = "SELECT * FROM users WHERE active = 1", nativeQuery = true)
    List<User> findActiveUsers();
}
```

---

## 🔐 **Security (JWT Pattern)**

### 1. Generate Token:
```java
String token = Jwts.builder()
    .setSubject(username)
    .claim("role", role)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
    .signWith(SignatureAlgorithm.HS256, secretKey)
    .compact();
```

### 2. Validate Token:
```java
Claims claims = Jwts.parser()
    .setSigningKey(secretKey)
    .parseClaimsJws(token)
    .getBody();
```

### 3. Secure Endpoints:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/auth/**").permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and().build();
    }
}
```

---

## 🧪 **Testing Patterns**

### Service Test:
```java
@SpringBootTest
class UserServiceTest {
    @Autowired
    private UserService service;
    
    @MockBean
    private UserRepository repository;
    
    @Test
    void testGetUser() {
        when(repository.findById(1L)).thenReturn(Optional.of(new User()));
        User user = service.getUser(1L);
        assertNotNull(user);
    }
}
```

### Controller Test:
```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }
}
```

---

## 💡 **Common Mistakes & Solutions**

### Mistake 1: Circular Dependency
```java
// ❌ BAD
@Service
class A {
    @Autowired B b;
}
@Service
class B {
    @Autowired A a;
}

// ✅ GOOD - Use @Lazy
@Service
class A {
    @Autowired @Lazy B b;
}
```

### Mistake 2: N+1 Query Problem
```java
// ❌ BAD - Makes many queries
@Entity
class Order {
    @OneToMany
    List<OrderItem> items;  // Lazy loading
}

// ✅ GOOD - Fetch eagerly or use JOIN FETCH
@Entity
class Order {
    @OneToMany(fetch = FetchType.EAGER)
    List<OrderItem> items;
}

// OR
@Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
Order findByIdWithItems(@Param("id") Long id);
```

### Mistake 3: Not Using DTOs
```java
// ❌ BAD - Exposes internal fields
@GetMapping
public User getUser() {
    return userRepository.findById(1L);  // Has password!
}

// ✅ GOOD - Use DTO
@GetMapping
public UserDTO getUser() {
    User user = userRepository.findById(1L);
    return new UserDTO(user);  // Only safe fields
}
```

---

## 🚀 **Microservices Quick Reference**

### Service Communication:
```java
// RestTemplate (Simple)
RestTemplate restTemplate = new RestTemplate();
User user = restTemplate.getForObject("http://user-service/users/1", User.class);

// WebClient (Better, Reactive)
WebClient client = WebClient.create("http://user-service");
Mono<User> user = client.get()
    .uri("/users/1")
    .retrieve()
    .bodyToMono(User.class);
```

### API Gateway Route:
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://localhost:8081
          predicates:
            - Path=/users/**
```

---

## 🎯 **Interview Quick Answers**

**Q: What is Spring Boot?**  
A: Extension of Spring Framework with auto-configuration, embedded server, and starter dependencies for rapid development.

**Q: Difference between @Component, @Service, @Repository?**  
A: All create beans. @Service for business logic, @Repository for DB access with exception translation, @Component is generic.

**Q: What is Dependency Injection?**  
A: Design pattern where Spring creates and injects dependencies instead of manual object creation.

**Q: How does auto-configuration work?**  
A: Spring Boot scans classpath, detects libraries, reads properties, auto-configures beans using @Conditional annotations.

**Q: What is JPA?**  
A: Java Persistence API - ORM specification for mapping Java objects to database tables.

---

## 📚 **Remember These Concepts**

✅ **IoC (Inversion of Control)** - Spring manages object lifecycle  
✅ **DI (Dependency Injection)** - Spring injects dependencies  
✅ **AOP (Aspect-Oriented Programming)** - Cross-cutting concerns  
✅ **Bean Lifecycle** - Instantiation → DI → Init → Use → Destroy  
✅ **Scopes** - singleton (default), prototype, request, session  

---

## 🎓 **You're Ready! Go Ace That Exam!** 🚀

**Remember:** 
- Spring Boot = Spring + Auto-config + Embedded Server + Starters
- @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
- Controller → Service → Repository pattern
- Always use DTOs
- Test everything!

**Good luck! 💪**
