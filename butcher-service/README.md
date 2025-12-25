# MEATHUB Butcher Service

A production-ready Spring Boot microservice for butcher onboarding, approval workflow, and meat item management.

## Technology Stack

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Security**: JWT-based authentication (validation only)
- **Database**: MySQL 8.0+
- **ORM**: JPA/Hibernate
- **JWT Library**: JJWT 0.12.3

## Features

- ✅ Butcher onboarding with business details
- ✅ Admin approval/rejection workflow
- ✅ Meat item catalog management
- ✅ Daily price and stock updates
- ✅ JWT token validation from auth-service
- ✅ Role-based access control (BUTCHER, ADMIN, USER)
- ✅ Global exception handling
- ✅ Input validation
- ✅ Stateless authentication

## Service Configuration

- **Service Name**: butcher-service
- **Port**: 8083
- **Database**: meathub_butcher

## Project Structure

```
butcher-service/
├── src/main/java/com/meathub/butcher/
│   ├── config/
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   ├── AdminController.java
│   │   ├── ButcherController.java
│   │   └── MeatItemController.java
│   ├── dto/
│   │   ├── ApprovalRequest.java
│   │   ├── ButcherOnboardRequest.java
│   │   ├── ButcherResponse.java
│   │   ├── MeatItemRequest.java
│   │   └── MeatItemResponse.java
│   ├── entity/
│   │   ├── Butcher.java
│   │   └── MeatItem.java
│   ├── exception/
│   │   ├── ButcherAlreadyExistsException.java
│   │   ├── ButcherNotFoundException.java
│   │   ├── ErrorResponse.java
│   │   ├── GlobalExceptionHandler.java
│   │   ├── MeatItemNotFoundException.java
│   │   └── UnauthorizedException.java
│   ├── repository/
│   │   ├── ButcherRepository.java
│   │   └── MeatItemRepository.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtService.java
│   │   └── UserPrincipal.java
│   ├── service/
│   │   ├── ButcherService.java
│   │   └── MeatItemService.java
│   └── ButcherServiceApplication.java
├── src/main/resources/
│   └── application.properties
├── database-setup.sql
├── README.md
├── QUICKSTART.md
└── pom.xml
```

## Prerequisites

1. **Java 17** or higher
2. **Maven 3.8+**
3. **MySQL 8.0+**
4. **Auth Service running** (port 8081) for JWT token generation

## Database Setup

1. Start MySQL server
2. Database will be created automatically
3. Update credentials in `application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

## Running the Application

### Using Maven

```bash
cd butcher-service
mvn clean install
mvn spring-boot:run
```

### Using JAR

```bash
cd butcher-service
mvn clean package
java -jar target/butcher-service-1.0.0.jar
```

Service starts on **http://localhost:8083**

## API Endpoints

### Butcher Management

#### 1. Onboard Butcher (BUTCHER role)

**Endpoint**: `POST /butchers/onboard`

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "businessName": "Fresh Meat Hub",
  "ownerName": "John Doe",
  "email": "john@freshmeat.com",
  "phone": "9876543210",
  "address": "123 Market Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "gstNumber": "27AABCU9603R1ZM",
  "fssaiLicense": "12345678901234",
  "description": "Quality meat supplier since 2010"
}
```

**Success Response** (201 Created):
```json
{
  "id": 1,
  "userId": 1,
  "businessName": "Fresh Meat Hub",
  "ownerName": "John Doe",
  "email": "john@freshmeat.com",
  "phone": "9876543210",
  "address": "123 Market Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "gstNumber": "27AABCU9603R1ZM",
  "fssaiLicense": "12345678901234",
  "description": "Quality meat supplier since 2010",
  "status": "PENDING",
  "isActive": true,
  "createdAt": "2024-12-16T13:00:00",
  "updatedAt": "2024-12-16T13:00:00"
}
```

#### 2. Get My Profile (BUTCHER role)

**Endpoint**: `GET /butchers/me`

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response** (200 OK): Same as onboard response

#### 3. Update My Profile (BUTCHER role)

**Endpoint**: `PUT /butchers/me`

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**: Same as onboard request

### Admin Operations

#### 4. Get All Butchers (ADMIN role)

**Endpoint**: `GET /admin/butchers`

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "userId": 1,
    "businessName": "Fresh Meat Hub",
    "status": "PENDING",
    ...
  }
]
```

#### 5. Approve Butcher (ADMIN role)

**Endpoint**: `PUT /admin/butchers/{id}/approve`

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "status": "APPROVED",
  "approvedAt": "2024-12-16T14:00:00",
  ...
}
```

#### 6. Reject Butcher (ADMIN role)

**Endpoint**: `PUT /admin/butchers/{id}/reject`

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "reason": "Invalid FSSAI license"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "status": "REJECTED",
  "rejectionReason": "Invalid FSSAI license",
  ...
}
```

### Meat Item Management

#### 7. Create Meat Item (BUTCHER role - requires APPROVED status)

**Endpoint**: `POST /meat-items`

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Chicken Breast",
  "description": "Fresh boneless chicken breast",
  "meatType": "CHICKEN",
  "cutType": "BONELESS",
  "pricePerKg": 280.00,
  "stockQuantityKg": 50,
  "isAvailable": true,
  "imageUrl": "https://example.com/chicken-breast.jpg",
  "unit": "KG"
}
```

**Meat Types**: `CHICKEN`, `MUTTON`, `FISH`, `PORK`, `BEEF`, `PRAWNS`, `OTHER`

**Cut Types**: `WHOLE`, `CURRY_CUT`, `BONELESS`, `WITH_BONE`, `MINCE`, `LIVER`, `BREAST`, `LEG`, `WING`, `FILLET`, `OTHER`

**Success Response** (201 Created):
```json
{
  "id": 1,
  "butcherId": 1,
  "butcherBusinessName": "Fresh Meat Hub",
  "name": "Chicken Breast",
  "description": "Fresh boneless chicken breast",
  "meatType": "CHICKEN",
  "cutType": "BONELESS",
  "pricePerKg": 280.00,
  "stockQuantityKg": 50,
  "isAvailable": true,
  "imageUrl": "https://example.com/chicken-breast.jpg",
  "unit": "KG",
  "createdAt": "2024-12-16T13:00:00",
  "updatedAt": "2024-12-16T13:00:00"
}
```

#### 8. Get My Meat Items (BUTCHER role)

**Endpoint**: `GET /meat-items/my`

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response** (200 OK): Array of meat items

#### 9. Update Meat Item (BUTCHER role)

**Endpoint**: `PUT /meat-items/{id}`

**Request Body**: Same as create

**Success Response** (200 OK): Updated meat item

#### 10. Delete Meat Item (BUTCHER role)

**Endpoint**: `DELETE /meat-items/{id}`

**Success Response** (204 No Content)

#### 11. Get Meat Items by Butcher (USER/BUTCHER/ADMIN role)

**Endpoint**: `GET /meat-items/by-butcher/{butcherId}`

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response** (200 OK): Array of available meat items

## Role-Based Access Control

| Endpoint | BUTCHER | ADMIN | USER |
|----------|---------|-------|------|
| POST /butchers/onboard | ✅ | ❌ | ❌ |
| GET /butchers/me | ✅ | ❌ | ❌ |
| PUT /butchers/me | ✅ | ❌ | ❌ |
| GET /admin/butchers | ❌ | ✅ | ❌ |
| PUT /admin/butchers/{id}/approve | ❌ | ✅ | ❌ |
| PUT /admin/butchers/{id}/reject | ❌ | ✅ | ❌ |
| POST /meat-items | ✅ (approved) | ❌ | ❌ |
| GET /meat-items/my | ✅ | ❌ | ❌ |
| PUT /meat-items/{id} | ✅ (own) | ❌ | ❌ |
| DELETE /meat-items/{id} | ✅ (own) | ❌ | ❌ |
| GET /meat-items/by-butcher/{id} | ✅ | ✅ | ✅ |

## Database Schema

### Butchers Table
```sql
CREATE TABLE butchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    business_name VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    gst_number VARCHAR(50),
    fssai_license VARCHAR(50),
    description VARCHAR(500),
    status VARCHAR(20) DEFAULT 'PENDING',
    rejection_reason VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL
);
```

### Meat Items Table
```sql
CREATE TABLE meat_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    butcher_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    meat_type VARCHAR(20) NOT NULL,
    cut_type VARCHAR(20) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL,
    stock_quantity_kg INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    unit VARCHAR(50) DEFAULT 'KG',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (butcher_id) REFERENCES butchers(id) ON DELETE CASCADE
);
```

## Business Workflow

### 1. Butcher Onboarding Flow
```
1. User registers with BUTCHER role (auth-service)
2. Butcher onboards with business details
3. Status = PENDING
4. Admin reviews application
5. Admin APPROVES or REJECTS
6. If approved, butcher can add meat items
```

### 2. Meat Item Management Flow
```
1. Butcher must be APPROVED
2. Butcher adds meat items
3. Updates price/stock daily
4. Users can browse items
5. Items available for ordering
```

## Security Features

1. **JWT Validation** - Validates tokens from auth-service
2. **Role-Based Access** - Enforces BUTCHER/ADMIN/USER permissions
3. **Approval Workflow** - Only approved butchers can sell
4. **Data Isolation** - Butchers can only manage own items
5. **Stateless Authentication** - No server-side sessions

## Configuration

### JWT Secret
Must match auth-service:
```properties
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

### Database Configuration
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/meathub_butcher
spring.datasource.username=root
spring.datasource.password=root
```

## Future Integration

- **API Gateway**: Route `/butchers/**` and `/meat-items/**` requests
- **Service Discovery**: Add Eureka/Consul support
- **Order Service**: Integration for meat item orders
- **Notification Service**: Alert butchers on approval/rejection

## Production Considerations

1. **JWT Secret**: Use environment variables
2. **Database**: Connection pooling (HikariCP included)
3. **Logging**: Configure log aggregation
4. **Monitoring**: Add Spring Boot Actuator
5. **Rate Limiting**: Implement for public endpoints
6. **HTTPS**: Always use HTTPS in production
7. **Image Storage**: Implement cloud storage for meat item images

## Environment Variables

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-db:3306/meathub_butcher
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
export JWT_SECRET=your-production-secret
```

---

**Version**: 1.0.0  
**Last Updated**: December 16, 2024  
**Maintained By**: MEATHUB Backend Team
