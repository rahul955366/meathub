# 🚀 QUICK START GUIDE

## Prerequisites Check
- [ ] Java 17 installed (`java -version`)
- [ ] Maven installed (`mvn -version`)
- [ ] MySQL running on localhost:3306
- [ ] MySQL credentials: username=root, password=root (or update application.properties)

## Step 1: Build the Project
```bash
cd auth-service
mvn clean install
```

## Step 2: Run the Application
```bash
mvn spring-boot:run
```

The service will start on **http://localhost:8081**

## Step 3: Test the API

### Option A: Using cURL

**Register a User:**
```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123","fullName":"Test User","phone":"1234567890","role":"USER"}'
```

**Login:**
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Option B: Using Postman
1. Import `MEATHUB-Auth-API.postman_collection.json` into Postman
2. Execute the requests

## Step 4: Verify Database
```bash
mysql -u root -p
USE meathub_auth;
SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM user_roles;
```

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL is running
- Update credentials in `src/main/resources/application.properties`
- Database `meathub_auth` will be created automatically

### Port Already in Use
- Change port in `application.properties`: `server.port=8082`

### Build Errors
- Ensure Java 17 is being used: `mvn -version`
- Clear Maven cache: `mvn clean`

## What's Next?
- ✅ Service is running on port 8081
- ✅ You can register users with roles: USER, BUTCHER, ADMIN
- ✅ JWT tokens are generated on login/register
- ✅ Ready for API Gateway integration

## Production Deployment
See `README.md` for detailed production deployment guidelines.
