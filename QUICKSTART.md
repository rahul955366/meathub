# 🚀 MEATHUB BACKEND - QUICK START GUIDE

## ⚡ 3-Step Launch

### **Step 1: Verify**
```batch
.\verify_backend.bat
```
This checks:
- MySQL is running
- All databases are created
- All JAR files exist
- No port conflicts

### **Step 2: Start**
```batch
.\start_all_services.bat
```
This starts all 14 microservices in the correct order.

### **Step 3: Test**
```batch
.\test_endpoints.bat
```
This verifies all services are responding.

---

## 🎯 Service URLs

Once started, access via API Gateway at: **http://localhost:8080**

| Service | Endpoint | Auth Required |
|---------|----------|---------------|
| Auth | /auth/** | No |
| Users | /users/** | Yes |
| Butchers | /butchers/** | Yes |
| Orders | /orders/** | Yes |
| Subscriptions | /subscriptions/** | Yes |
| Delivery | /deliveries/** | Yes |
| Gym | /gym/** | Yes |
| Pet | /pet/** | Yes |
| Media | /media/** | Yes |
| Admin | /admin/** | Yes |
| Notifications | /notifications/** | Yes |

---

## 🔑 Test Authentication

### Register:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","role":"CUSTOMER"}'
```

### Login:
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

### Use Token:
```bash
curl -X GET http://localhost:8080/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🛑 Stop Services

Close the individual service console windows that appear when you run `start_all_services.bat`.

---

## 📚 Documentation

- **FINAL_STATUS.md** - Complete system status
- **BACKEND_READY.md** - Deployment guide
- **BACKEND_HEALTH_CHECK.md** - Detailed analysis
- **README.md** - Individual service docs

---

## ✅ Checklist

- [ ] MySQL running on port 3306 (root/root)
- [ ] Ran verify_backend.bat
- [ ] Ran start_all_services.bat
- [ ] All services started successfully
- [ ] Frontend running on port 5173
- [ ] Can login from frontend

---

**READY TO GO! 🚀**
