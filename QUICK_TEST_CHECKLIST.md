# ✅ MEATHUB - QUICK TEST CHECKLIST

## 🎯 Project Status Check

### Step 1: Verify Services Are Running

**Check Backend (API Gateway):**
- Open: http://localhost:8080/auth/login
- **Expected:** HTTP response (error is OK, means it's running)
- **If "Connection refused":** Services still starting, wait 1-2 more minutes

**Check Frontend:**
- Open: http://localhost:5173
- **Expected:** MEATHUB home page loads
- **If blank/error:** Wait a bit more or check browser console

---

## 🧪 FUNCTIONALITY TESTS

### Test 1: User Registration ✅
1. Open http://localhost:5173
2. Click **"Login"** button (top right)
3. Click **"Register"** tab
4. Fill in:
   - Name: `Test User`
   - Email: `test@test.com`
   - Phone: `9876543210`
   - Password: `test123`
   - Role: `Customer`
5. Click **"Register"**
6. **Expected:** ✅ Success message, logged in automatically

### Test 2: Product Browsing ✅
1. After login, scroll down home page
2. Check categories: Chicken, Mutton, Fish, Prawns, Marinated
3. **Expected:** ✅ Products load (may be empty if no butcher items)
4. **If error:** Check browser console (F12)

### Test 3: Add to Cart ✅
1. If products are available, click **"Add to Cart"** on any product
2. Click cart icon (top right)
3. **Expected:** ✅ Item appears in cart

### Test 4: Place Order ✅
1. Go to cart page
2. Add delivery address (if needed)
3. Click **"Proceed to Checkout"**
4. Click **"Place Order"**
5. **Expected:** ✅ Order placed, tracker appears on home page

### Test 5: AI Chat ✅
1. Click **AI assistant button** (floating, bottom right)
2. Type: `Track my order` or `Hello`
3. **Expected:** ✅ Real AI response received

### Test 6: Order Tracking ✅
1. After placing order, check home page
2. Look for **"Live Order Tracker"** card
3. **Expected:** ✅ Order status visible, updates every 5 seconds

---

## 🔍 TROUBLESHOOTING

### If Registration Fails:
- Check browser console (F12) for errors
- Verify API Gateway is running (http://localhost:8080)
- Check auth-service window for errors

### If Products Don't Load:
- This is normal if no butchers have added products yet
- To add products: Register as BUTCHER → Get approved → Add items

### If "Failed to fetch" Errors:
- Check if all 14 service windows are open
- Verify API Gateway is running on port 8080
- Check service windows for error messages
- Wait 2-3 minutes for full startup

### If Frontend Won't Load:
- Check if frontend window is running
- Check browser console (F12)
- Verify port 5173 is not in use

---

## 📊 SERVICE STATUS CHECK

### Check All Services:
You should see **14 service windows** open:
- ✅ Auth Service (8081)
- ✅ User Service (8082)
- ✅ Butcher Service (8083)
- ✅ Order Service (8084)
- ✅ Subscription Service (8085)
- ✅ Delivery Service (8086)
- ✅ Gym Service (8087)
- ✅ Pet Service (8088)
- ✅ Media Service (8089)
- ✅ Admin Service (8090)
- ✅ Notification Service (8091)
- ✅ AI Service (8092)
- ✅ Blockchain Service (8093)
- ✅ **API Gateway (8080)** ← Most Important!

### Quick Port Check:
```batch
netstat -ano | findstr ":8080\|:5173" | findstr "LISTENING"
```
Should show both ports.

---

## ✅ SUCCESS CRITERIA

Everything is working if:
- ✅ All 14 service windows open
- ✅ http://localhost:8080 responds
- ✅ http://localhost:5173 shows home page
- ✅ Can register new user
- ✅ Can login
- ✅ Products page loads (even if empty)
- ✅ AI chat responds
- ✅ No "Failed to fetch" errors in console

---

## 🎉 READY TO TEST!

**Go to http://localhost:5173 and start testing! 🚀**

---

## 📝 NOTES

- **First time:** Products may be empty (need butcher to add items)
- **Orders:** Can only place if products exist in cart
- **AI Chat:** Requires backend AI service running
- **All services:** Must stay running (keep windows open)

---

**Happy Testing! 🎊**

