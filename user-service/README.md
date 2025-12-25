# MEATHUB User Service

A production-ready Spring Boot microservice for user profile and address management.

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Security**: JWT-based authentication (validation only)
- **Database**: MySQL 8.0+
- **ORM**: JPA/Hibernate
- **JWT Library**: JJWT 0.12.3

## Features

- ✅ User profile management (create, read, update)
- ✅ Address management (CRUD operations)
- ✅ JWT token validation from auth-service
- ✅ Role-based access control (USER, ADMIN, BUTCHER)
- ✅ Global exception handling
- ✅ Input validation
- ✅ Stateless authentication

## Service Configuration

- **Service Name**: user-service
- **Port**: 8082
- **Database**: meathub_user

## Project Structure

```
user-service/
├── src/
│   ├── main/
│   │   ├── java/com/meathub/user/
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   └── UserController.java
│   │   │   ├── dto/
│   │   │   │   ├── AddressRequest.java
│   │   │   │   ├── AddressResponse.java
│   │   │   │   ├── UserProfileRequest.java
│   │   │   │   └── UserProfileResponse.java
│   │   │   ├── entity/
│   │   │   │   ├── Address.java
│   │   │   │   └── UserProfile.java
│   │   │   ├── exception/
│   │   │   │   ├── AddressNotFoundException.java
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── UnauthorizedException.java
│   │   │   │   └── UserProfileNotFoundException.java
│   │   │   ├── repository/
│   │   │   │   ├── AddressRepository.java
│   │   │   │   └── UserProfileRepository.java
│   │   │   ├── security/
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── JwtService.java
│   │   │   ├── service/
│   │   │   │   ├── AddressService.java
│   │   │   │   └── UserProfileService.java
│   │   │   └── UserServiceApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Prerequisites

1. **Java 17** or higher
2. **Maven 3.8+**
3. **MySQL 8.0+**
4. **Auth Service running** (for JWT token generation)

## Database Setup

1. Start MySQL server
2. Database will be created automatically by the application
3. Update credentials in `src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

## Running the Application

### Using Maven

```bash
cd user-service
mvn clean install
mvn spring-boot:run
```

### Using JAR

```bash
cd user-service
mvn clean package
java -jar target/user-service-1.0.0.jar
```

The service will start on **http://localhost:8082**

## API Endpoints

### User Profile Endpoints

#### 1. Get User Profile

**Endpoint**: `GET /users/profile`

**Query Parameters**:
- `userId` (optional): Only admins can specify userId to view other profiles

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "userId": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "bio": "Software Developer",
  "profileImageUrl": "https://example.com/profile.jpg",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01T00:00:00",
  "createdAt": "2024-12-16T12:00:00",
  "updatedAt": "2024-12-16T12:00:00"
}
```

#### 2. Update User Profile

**Endpoint**: `PUT /users/profile`

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "bio": "Software Developer",
  "profileImageUrl": "https://example.com/profile.jpg",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01T00:00:00"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "userId": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "bio": "Software Developer",
  "profileImageUrl": "https://example.com/profile.jpg",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01T00:00:00",
  "createdAt": "2024-12-16T12:00:00",
  "updatedAt": "2024-12-16T12:30:00"
}
```

### Address Endpoints

#### 3. Get All Addresses

**Endpoint**: `GET /users/address`

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "addressType": "HOME",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India",
    "landmark": "Near Station",
    "isDefault": true,
    "createdAt": "2024-12-16T12:00:00",
    "updatedAt": "2024-12-16T12:00:00"
  }
]
```

#### 4. Create Address

**Endpoint**: `POST /users/address`

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "addressType": "HOME",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "landmark": "Near Station",
  "isDefault": true
}
```

**Success Response** (201 Created):
```json
{
  "id": 1,
  "addressType": "HOME",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "landmark": "Near Station",
  "isDefault": true,
  "createdAt": "2024-12-16T12:00:00",
  "updatedAt": "2024-12-16T12:00:00"
}
```

#### 5. Update Address

**Endpoint**: `PUT /users/address/{id}`

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "addressType": "WORK",
  "addressLine1": "456 Corporate Blvd",
  "addressLine2": "Floor 10",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400002",
  "country": "India",
  "landmark": "Tech Park",
  "isDefault": false
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "addressType": "WORK",
  "addressLine1": "456 Corporate Blvd",
  "addressLine2": "Floor 10",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400002",
  "country": "India",
  "landmark": "Tech Park",
  "isDefault": false,
  "createdAt": "2024-12-16T12:00:00",
  "updatedAt": "2024-12-16T12:30:00"
}
```

#### 6. Delete Address

**Endpoint**: `DELETE /users/address/{id}`

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response** (204 No Content)

## Role-Based Access Control

### USER Role
- ✅ Can view own profile
- ✅ Can update own profile
- ✅ Can manage own addresses (CRUD)
- ❌ Cannot view other users' profiles

### ADMIN Role
- ✅ Can view any user's profile
- ✅ Can manage own profile
- ✅ Can manage own addresses
- ✅ Can delete any address

### BUTCHER Role
- ❌ No access to user service endpoints

## Sample cURL Requests

### Get JWT Token (from auth-service)
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123"
  }'
```

### Update Profile
```bash
curl -X PUT http://localhost:8082/users/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "bio": "Software Developer",
    "gender": "MALE"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:8082/users/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Create Address
```bash
curl -X POST http://localhost:8082/users/address \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "addressType": "HOME",
    "addressLine1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India",
    "isDefault": true
  }'
```

### Get All Addresses
```bash
curl -X GET http://localhost:8082/users/address \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Database Schema

### User Profiles Table
```sql
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    bio VARCHAR(500),
    profile_image_url VARCHAR(255),
    gender VARCHAR(10),
    date_of_birth DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Addresses Table
```sql
CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_profile_id BIGINT NOT NULL,
    address_type VARCHAR(50) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) NOT NULL,
    landmark VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);
```

## Security Features

1. **JWT Validation**: Validates tokens generated by auth-service
2. **Role-Based Access**: Enforces USER/ADMIN/BUTCHER permissions
3. **Stateless Authentication**: No server-side sessions
4. **CSRF Protection**: Disabled (suitable for stateless REST APIs)
5. **Input Validation**: Bean validation on all request DTOs
6. **Global Exception Handling**: Consistent error responses

## Configuration

### JWT Secret
**Important**: The JWT secret must match the auth-service secret:
```properties
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

### Database Configuration
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/meathub_user
spring.datasource.username=root
spring.datasource.password=root
```

## Integration with Auth Service

This service validates JWT tokens generated by the auth-service. The workflow is:

1. User registers/logs in via **auth-service** (port 8081)
2. Auth-service returns a JWT token
3. User sends requests to **user-service** (port 8082) with the JWT token
4. User-service validates the token and extracts userId and roles
5. Operations are performed based on authorization

## Future Integration

This service is designed to work with:
- **API Gateway**: Route `/users/**` requests to this service
- **Service Discovery**: Add Spring Cloud dependencies for Eureka/Consul
- **Other Microservices**: Share JWT validation logic

## Testing

Run tests:
```bash
mvn test
```

## Production Considerations

1. **JWT Secret**: Use environment variable for JWT secret
2. **Database**: Use connection pooling (HikariCP - included by default)
3. **Logging**: Configure proper log levels
4. **Monitoring**: Add Spring Boot Actuator
5. **HTTPS**: Always use HTTPS in production
6. **CORS**: Configure if consumed by frontend

## Environment Variables

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/meathub_user
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
export JWT_SECRET=your-production-secret
```

---

**Version**: 1.0.0  
**Last Updated**: December 16, 2024  
**Maintained By**: MEATHUB Backend Team
