# 🚀 MEATHUB - QUICK START & TEST GUIDE

## ⚡ FASTEST WAY TO RUN

### Step 1: Start Everything
```batch
START_MEATHUB.bat
```

This single command will:
- ✅ Verify backend setup
- ✅ Start all 14 microservices
- ✅ Start frontend
- ✅ Open browser

**Wait 2-3 minutes for all services to start!**

---

## 🧪 QUICK FUNCTIONALITY TEST

### Test 1: Registration & Login (2 minutes)
1. Open http://localhost:5173
2. Click "Login" → "Register"
3. Register with:
   - Name: Test User
   - Email: test@test.com
   - Phone: 9876543210
   - Password: test123
   - Role: Customer
4. Click "Register"
5. **Expected:** ✅ Success, logged in

### Test 2: Product Browsing (1 minute)
1. After login, scroll down home page
2. Check if products load
3. **Expected:** ✅ Products display (may be empty if no butcher products)

### Test 3: AI Chat (30 seconds)
1. Click AI button (bottom right)
2. Type: "Hello"
3. **Expected:** ✅ Real AI response

### Test 4: Cart & Order (3 minutes)
1. If products exist, click "Add to Cart"
2. Go to cart
3. Add delivery address
4. Place order
5. **Expected:** ✅ Order placed, tracker appears

---

## ⚠️ IMPORTANT NOTES

### If Products Don't Show:
Products need to be created by butchers first. To test:
1. Register as BUTCHER
2. Complete onboarding
3. Get admin approval
4. Add meat items

### If Services Fail:
- Check individual service windows for errors
- Ensure MySQL is running (port 3306)
- Check ports 8080-8093 are free

### If Frontend Won't Connect:
- Verify API Gateway is running (port 8080)
- Check browser console (F12)
- Verify `.env` file exists with `VITE_API_GATEWAY_URL=http://localhost:8080`

---

## 📊 VERIFY SERVICES ARE RUNNING

Check these URLs in browser or Postman:

```
✅ http://localhost:8080/auth/login (should respond)
✅ http://localhost:8080/butchers/items/available (needs auth)
✅ http://localhost:8080/ai/chat (needs auth)
```

---

## 🛑 TO STOP

Close all service windows OR press Ctrl+C in each window.

---

**Ready to test! Run `START_MEATHUB.bat` now! 🚀**

