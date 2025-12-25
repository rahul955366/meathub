# 🚀 QUICK START GUIDE

## Prerequisites Check
- [ ] Java 17 installed (`java -version`)
- [ ] Maven installed (`mvn -version`)
- [ ] MySQL running on localhost:3306
- [ ] Auth-service running on port 8081

## Step 1: Build the Project
```bash
cd butcher-service
mvn clean install
```

## Step 2: Run the Application
```bash
mvn spring-boot:run
```

Service starts on **http://localhost:8083**

## Step 3: Get JWT Tokens

### For BUTCHER Role
```bash
# Register as BUTCHER
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "butcher1",
    "email": "butcher1@example.com",
    "password": "Secure123",
    "fullName": "Butcher One",
    "phone": "9876543210",
    "role": "BUTCHER"
  }'
```

### For ADMIN Role
```bash
# Register as ADMIN
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@meathub.com",
    "password": "Admin123",
    "fullName": "Admin User",
    "phone": "5555555555",
    "role": "ADMIN"
  }'
```

Copy JWT tokens from responses.

## Step 4: Test Butcher Onboarding

```bash
curl -X POST http://localhost:8083/butchers/onboard \
  -H "Authorization: Bearer BUTCHER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
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
    "description": "Quality meat supplier"
  }'
```

## Step 5: Admin Approves Butcher

```bash
# Get all butchers
curl -X GET http://localhost:8083/admin/butchers \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Approve butcher (use butcher ID from response)
curl -X PUT http://localhost:8083/admin/butchers/1/approve \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Step 6: Add Meat Items

```bash
curl -X POST http://localhost:8083/meat-items \
  -H "Authorization: Bearer BUTCHER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chicken Breast",
    "description": "Fresh boneless chicken breast",
    "meatType": "CHICKEN",
    "cutType": "BONELESS",
    "pricePerKg": 280.00,
    "stockQuantityKg": 50,
    "isAvailable": true,
    "unit": "KG"
  }'
```

## Step 7: Verify Database

```bash
mysql -u root -p
USE meathub_butcher;
SELECT * FROM butchers;
SELECT * FROM meat_items;
```

## Common Workflows

### Butcher Workflow
1. Register as BUTCHER
2. Onboard with business details
3. Wait for admin approval
4. Add meat items
5. Update prices/stock daily

### Admin Workflow
1. Register as ADMIN
2. View pending butchers
3. Approve or reject applications
4. Monitor all butchers

### User Workflow
1. Register as USER
2. Browse meat items by butcher
3. View available items

## Troubleshooting

### "Butcher must be approved before adding items"
- Admin must approve your butcher profile first
- Check status: `GET /butchers/me`

### "Butcher profile already exists"
- Each user can only have one butcher profile
- Update existing profile using `PUT /butchers/me`

### Port Already in Use
- Change port in `application.properties`: `server.port=8084`

### JWT Validation Errors
- Ensure JWT secret matches auth-service
- Check if token is expired (24 hours validity)

## What's Next?
- ✅ Service running on port 8083
- ✅ Butcher onboarding workflow complete
- ✅ Meat item management working
- ✅ Ready for API Gateway integration

## Production Deployment
See `README.md` for detailed production guidelines.
