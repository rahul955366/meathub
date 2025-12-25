# 🚀 QUICK START GUIDE

## Prerequisites Check
- [ ] Java 17 installed (`java -version`)
- [ ] Maven installed (`mvn -version`)
- [ ] MySQL running on localhost:3306
- [ ] MySQL credentials: username=root, password=root (or update application.properties)
- [ ] Auth Service running on port 8081 (to generate JWT tokens)

## Step 1: Build the Project
```bash
cd user-service
mvn clean install
```

## Step 2: Run the Application
```bash
mvn spring-boot:run
```

The service will start on **http://localhost:8082**

## Step 3: Get a JWT Token

First, register or login via auth-service to get a JWT token:

```bash
# Login to auth-service
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

Copy the JWT token from the response.

## Step 4: Test the User Service

### Create/Update Profile
```bash
curl -X PUT http://localhost:8082/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "bio": "Testing MEATHUB",
    "gender": "MALE"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:8082/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Add Address
```bash
curl -X POST http://localhost:8082/users/address \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
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

## Step 5: Verify Database
```bash
mysql -u root -p
USE meathub_user;
SELECT * FROM user_profiles;
SELECT * FROM addresses;
```

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL is running
- Update credentials in `src/main/resources/application.properties`
- Database `meathub_user` will be created automatically

### Port Already in Use
- Change port in `application.properties`: `server.port=8083`

### JWT Validation Errors
- Ensure JWT secret matches auth-service
- Check if token is expired (tokens expire after 24 hours)

### Build Errors
- Ensure Java 17 is being used: `mvn -version`
- Clear Maven cache: `mvn clean`

## What's Next?
- ✅ Service is running on port 8082
- ✅ Profile and address management working
- ✅ JWT validation enabled
- ✅ Ready for API Gateway integration

## Production Deployment
See `README.md` for detailed production deployment guidelines.
