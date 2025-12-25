# 🚀 MEATHUB - RUN INSTRUCTIONS

## ✅ READY TO RUN!

All gaps have been fixed. The project is ready for testing.

---

## 🎯 QUICK START (EASIEST WAY)

### Single Command Launch:
```batch
START_MEATHUB.bat
```

**What it does:**
1. Verifies backend setup (MySQL, databases, JAR files)
2. Starts all 14 microservices (opens 14 windows)
3. Waits for services to initialize
4. Starts frontend (opens browser at http://localhost:5173)

**Time:** ~2-3 minutes for all services to start

---

## 📋 MANUAL START (IF NEEDED)

### Step 1: Verify Backend
```batch
verify_backend.bat
```

### Step 2: Start Backend Services
```batch
start_all_services.bat
```
Wait 2-3 minutes for all services to start.

### Step 3: Start Frontend
```batch
cd "MEATHUB Application Design"
npm install    # First time only
npm run dev
```

---

## 🧪 TESTING CHECKLIST

Once everything is running:

### ✅ Basic Tests
- [ ] Open http://localhost:5173
- [ ] Register a new user
- [ ] Login with registered user
- [ ] Browse products on home page
- [ ] Click AI chat button (bottom right)
- [ ] Send message to AI

### ✅ Order Flow Tests
- [ ] Add product to cart (if products exist)
- [ ] View cart
- [ ] Place order
- [ ] Check order tracker on home page
- [ ] View order history in profile

### ✅ Advanced Tests
- [ ] Register as BUTCHER
- [ ] Complete butcher onboarding
- [ ] Register as ADMIN
- [ ] Approve butcher (as admin)
- [ ] Add meat items (as approved butcher)
- [ ] View products on home page

---

## 🔍 VERIFY SERVICES

### Check API Gateway:
Open browser: http://localhost:8080/auth/login
- Should see error (needs POST request) = Gateway is working ✅

### Check Frontend:
Open browser: http://localhost:5173
- Should see MEATHUB home page ✅

### Check Service Windows:
You should see 14 service windows open:
1. Auth Service (8081)
2. User Service (8082)
3. Butcher Service (8083)
4. Order Service (8084)
5. Subscription Service (8085)
6. Delivery Service (8086)
7. Gym Service (8087)
8. Pet Service (8088)
9. Media Service (8089)
10. Admin Service (8090)
11. Notification Service (8091)
12. AI Service (8092)
13. Blockchain Service (8093)
14. API Gateway (8080)

---

## ⚠️ TROUBLESHOOTING

### Services won't start?
- Check MySQL is running: `mysql -uroot -proot -e "SELECT 1;"`
- Check ports are free: `netstat -ano | findstr ":8080"`
- Rebuild JARs: `build-all.bat`

### Frontend won't connect?
- Check API Gateway is running (port 8080)
- Check browser console (F12) for errors
- Verify `.env` file exists in "MEATHUB Application Design" folder

### No products showing?
- Products need to be created by butchers first
- Register as butcher → Get approved → Add products

### Authentication fails?
- Check auth-service window for errors
- Verify database connection
- Check JWT secret matches

---

## 📊 WHAT'S WORKING

✅ **Fully Functional:**
- User registration & login
- Product browsing (from backend)
- Cart management
- Order placement
- Order tracking (live updates)
- AI chat
- Subscriptions
- Profile management

⚠️ **Needs Data:**
- Products (create via butcher)
- Orders (place some first)
- Subscriptions (create some first)

---

## 🎉 READY TO TEST!

Run `START_MEATHUB.bat` and start testing!

**Expected Time:** 2-3 minutes for full startup

---

**Good luck! 🚀**

