# MEATHUB Auth Service

A production-ready Spring Boot microservice for authentication and authorization.

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Security**: JWT-based authentication
- **Database**: MySQL 8.0+
- **ORM**: JPA/Hibernate
- **Password Encoding**: BCrypt
- **JWT Library**: JJWT 0.12.3

## Features

- ✅ User Registration with role assignment (USER, BUTCHER, ADMIN)
- ✅ Login with JWT token generation
- ✅ Secure password storage using BCrypt
- ✅ Token validation and authentication
- ✅ Role-based access control
- ✅ Global exception handling
- ✅ Input validation
- ✅ Stateless authentication

## Service Configuration

- **Service Name**: auth-service
- **Port**: 8081
- **Database**: meathub_auth

## Project Structure

```
auth-service/
├── src/
│   ├── main/
│   │   ├── java/com/meathub/auth/
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   └── AuthController.java
│   │   │   ├── dto/
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── RegisterRequest.java
│   │   │   ├── entity/
│   │   │   │   ├── Role.java
│   │   │   │   └── User.java
│   │   │   ├── exception/
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── InvalidRoleException.java
│   │   │   │   └── UserAlreadyExistsException.java
│   │   │   ├── repository/
│   │   │   │   ├── RoleRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── JwtService.java
│   │   │   ├── service/
│   │   │   │   └── AuthService.java
│   │   │   └── AuthServiceApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Prerequisites

1. **Java 17** or higher
2. **Maven 3.8+**
3. **MySQL 8.0+**

## Database Setup

1. Start MySQL server
2. Create database (optional - auto-created by application):
   ```sql
   CREATE DATABASE meathub_auth;
   ```

3. Update database credentials in `src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

## Running the Application

### Using Maven

```bash
cd auth-service
mvn clean install
mvn spring-boot:run
```

### Using JAR

```bash
cd auth-service
mvn clean package
java -jar target/auth-service-1.0.0.jar
```

The service will start on **http://localhost:8081**

## API Endpoints

### 1. User Registration

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "phone": "1234567890",
  "role": "USER"
}
```

**Roles**: `USER`, `BUTCHER`, `ADMIN`

**Success Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "roles": ["USER"]
}
```

**Error Response** (409 Conflict):
```json
{
  "timestamp": "2024-12-16T12:00:00",
  "status": 409,
  "error": "Conflict",
  "message": "Username already exists: john_doe",
  "path": "/auth/register"
}
```

### 2. User Login

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "roles": ["USER"]
}
```

**Error Response** (401 Unauthorized):
```json
{
  "timestamp": "2024-12-16T12:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password",
  "path": "/auth/login"
}
```

## Sample cURL Requests

### Register a User
```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "fullName": "John Doe",
    "phone": "1234567890",
    "role": "USER"
  }'
```

### Register a Butcher
```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "butcher_bob",
    "email": "bob@meatshop.com",
    "password": "BobSecure456",
    "fullName": "Bob the Butcher",
    "phone": "9876543210",
    "role": "BUTCHER"
  }'
```

### Register an Admin
```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@meathub.com",
    "password": "AdminSecure789",
    "fullName": "Admin User",
    "phone": "5555555555",
    "role": "ADMIN"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123"
  }'
```

### Use JWT Token (Example with Protected Endpoint)
```bash
curl -X GET http://localhost:8081/api/protected \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

## JWT Token Usage

After login or registration, you receive a JWT token. Include this token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

**Token Expiration**: 24 hours (86400000 ms)

## Security Features

1. **BCrypt Password Encoding**: All passwords are hashed using BCrypt with strength 10
2. **JWT Authentication**: Stateless token-based authentication
3. **Role-Based Access**: Users assigned roles (USER, BUTCHER, ADMIN)
4. **CSRF Protection**: Disabled (suitable for stateless REST APIs)
5. **Session Management**: Stateless (no server-side sessions)
6. **Input Validation**: Bean validation on all request DTOs
7. **Global Exception Handling**: Consistent error responses

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Roles Table
```sql
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);
```

### User-Roles Join Table
```sql
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

## Configuration

### Changing JWT Secret

Update in `application.properties`:
```properties
jwt.secret=your-new-base64-encoded-secret-key
```

**Important**: Use a strong, randomly generated secret in production.

### Changing Token Expiration

Update in `application.properties`:
```properties
jwt.expiration=86400000  # 24 hours in milliseconds
```

### Database Configuration

Update in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/meathub_auth
spring.datasource.username=your-username
spring.datasource.password=your-password
```

## Future Integration

This service is designed to work seamlessly with:
- **API Gateway**: Register this service with your API Gateway
- **Service Discovery**: Add Spring Cloud dependencies for Eureka/Consul
- **Other Microservices**: Share JWT tokens across services

### API Gateway Integration

When integrating with an API Gateway, route `/auth/**` requests to this service:

```yaml
# Example Spring Cloud Gateway route
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://localhost:8081
          predicates:
            - Path=/auth/**
```

## Testing

Run tests:
```bash
mvn test
```

Run with coverage:
```bash
mvn clean test jacoco:report
```

## Production Considerations

1. **JWT Secret**: Use environment variable for JWT secret
2. **Database**: Use connection pooling (HikariCP - included by default)
3. **Logging**: Configure proper log levels and log aggregation
4. **Monitoring**: Add Spring Boot Actuator for health checks
5. **Rate Limiting**: Implement rate limiting for auth endpoints
6. **HTTPS**: Always use HTTPS in production
7. **CORS**: Configure CORS if consumed by frontend

## Environment Variables

For production deployment, use environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/meathub_auth
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
export JWT_SECRET=your-production-secret
export JWT_EXPIRATION=3600000
```

## Support

For issues or questions, contact the backend team.

---

**Version**: 1.0.0  
**Last Updated**: December 16, 2024  
**Maintained By**: MEATHUB Backend Team
