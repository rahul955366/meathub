# 🧪 MEATHUB - COMPLETE TESTING GUIDE

## 🚀 Quick Start

### Option 1: Automated Launch (Recommended)
```batch
START_MEATHUB.bat
```
This will:
1. Verify backend setup
2. Start all 14 microservices
3. Start frontend
4. Open browser

### Option 2: Manual Launch
```batch
# Terminal 1: Start Backend
verify_backend.bat
start_all_services.bat

# Terminal 2: Start Frontend
cd "MEATHUB Application Design"
npm install  # First time only
npm run dev
```

---

## ✅ Pre-Flight Checklist

Before testing, ensure:
- [ ] MySQL is running on port 3306 (username: root, password: root)
- [ ] All JAR files are built (run `build-all.bat` if needed)
- [ ] Ports 8080-8093 are available
- [ ] Port 5173 is available (for frontend)

---

## 🧪 TESTING SCENARIOS

### Test 1: User Registration & Login ✅

**Steps:**
1. Open http://localhost:5173
2. Click "Login" button (top right)
3. Click "Register" tab
4. Fill in:
   - Name: Test User
   - Email: test@test.com
   - Phone: 9876543210
   - Password: test123
   - Role: Customer
5. Click "Register"

**Expected:**
- ✅ Success message appears
- ✅ User is logged in
- ✅ Home page shows user name

**Backend Check:**
```bash
# Verify user created in database
mysql -uroot -proot -e "USE meathub_auth; SELECT * FROM users;"
```

---

### Test 2: Product Browsing ✅

**Steps:**
1. After login, scroll down on home page
2. Check categories: Chicken, Mutton, Fish, Prawns, Marinated
3. Click on a product card

**Expected:**
- ✅ Products load from backend
- ✅ Categories display correctly
- ✅ Product detail page opens
- ✅ No "Loading..." message stuck

**Backend Check:**
```bash
# Check if products exist (need to create via butcher first)
curl http://localhost:8080/butchers/items/available \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Note:** If no products show, you need to:
1. Register as a BUTCHER
2. Complete butcher onboarding
3. Get admin approval
4. Add meat items

---

### Test 3: Add to Cart ✅

**Steps:**
1. Browse products
2. Click "Add to Cart" on any product
3. Click cart icon (top right)
4. View cart page

**Expected:**
- ✅ Item added to cart
- ✅ Cart shows item
- ✅ Quantity can be updated
- ✅ Total calculated correctly

**Backend Check:**
```bash
# View cart via API
curl http://localhost:8080/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Test 4: Place Order ✅

**Steps:**
1. Add items to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. Select delivery address (or add new)
5. Click "Place Order"

**Expected:**
- ✅ Order placed successfully
- ✅ Order appears on home page (live tracker)
- ✅ Order status shows "PLACED"
- ✅ Cart is cleared

**Backend Check:**
```bash
# View orders
curl http://localhost:8080/orders/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Test 5: Order Status Tracking ✅

**Steps:**
1. After placing order, check home page
2. Look for "Live Order Tracker" card
3. Wait 5 seconds (polling interval)
4. Check if status updates

**Expected:**
- ✅ Order tracker visible on home page
- ✅ Status updates automatically
- ✅ Progress bar shows progress
- ✅ Estimated delivery time shown

**Backend Check:**
```bash
# Update order status (as butcher)
curl -X PUT http://localhost:8080/butcher/orders/1/status \
  -H "Authorization: Bearer BUTCHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CUTTING"}'
```

---

### Test 6: AI Chat ✅

**Steps:**
1. Click AI assistant button (bottom right, floating)
2. Send message: "Track my order"
3. Wait for response

**Expected:**
- ✅ AI chat opens
- ✅ Message sent successfully
- ✅ Real AI response received
- ✅ No mock responses

**Backend Check:**
```bash
# Test AI endpoint
curl -X POST http://localhost:8080/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Track my order", "language": "en"}'
```

---

### Test 7: Subscription Management ✅

**Steps:**
1. Go to product detail page
2. Click "Subscribe" button
3. Fill subscription details
4. Create subscription
5. Go to profile page
6. Check subscriptions tab

**Expected:**
- ✅ Subscription created
- ✅ Shows in profile
- ✅ Can pause/resume
- ✅ Next delivery date shown

**Backend Check:**
```bash
# View subscriptions
curl http://localhost:8080/subscriptions/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Test 8: Butcher Flow ✅

**Steps:**
1. Register as BUTCHER
2. Login
3. Complete business onboarding
4. Wait for admin approval
5. Add meat items
6. View orders assigned to you

**Expected:**
- ✅ Butcher registration works
- ✅ Onboarding form submits
- ✅ Approval status shown
- ✅ Can add products after approval
- ✅ Can view assigned orders

**Backend Check:**
```bash
# Get butcher profile
curl http://localhost:8080/butchers/me \
  -H "Authorization: Bearer BUTCHER_TOKEN"

# Add meat item
curl -X POST http://localhost:8080/butchers/items \
  -H "Authorization: Bearer BUTCHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chicken Breast",
    "description": "Fresh boneless chicken",
    "price": 280,
    "quantity": 50,
    "category": "CHICKEN",
    "imageUrl": "https://example.com/chicken.jpg"
  }'
```

---

### Test 9: Admin Flow ✅

**Steps:**
1. Register as ADMIN (or use existing admin account)
2. Login
3. View admin dashboard
4. Check butcher approvals
5. Approve/reject butchers
6. View system statistics

**Expected:**
- ✅ Admin dashboard loads
- ✅ Stats displayed
- ✅ Butcher list shown
- ✅ Can approve/reject
- ✅ Charts display data

**Backend Check:**
```bash
# Get dashboard stats
curl http://localhost:8080/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Get all butchers
curl http://localhost:8080/butchers/admin \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🔍 TROUBLESHOOTING

### Issue: Services won't start
**Solution:**
- Check if MySQL is running
- Check if ports are available
- Verify JAR files exist (run `build-all.bat`)
- Check service logs in individual windows

### Issue: Frontend can't connect to backend
**Solution:**
- Verify API Gateway is running on port 8080
- Check browser console for CORS errors
- Verify `.env` file has correct API Gateway URL
- Check network tab in browser DevTools

### Issue: Authentication fails
**Solution:**
- Check auth-service is running
- Verify JWT secret matches across services
- Check database connection
- Verify user exists in database

### Issue: Products don't load
**Solution:**
- Products need to be created by butchers first
- Register as butcher, get approved, add products
- Or check if `getAvailableItems()` endpoint works

### Issue: Cart/Orders fail
**Solution:**
- Verify order-service is running
- Check JWT token is valid
- Verify user is logged in
- Check browser console for errors

---

## 📊 API ENDPOINT TESTING

### Test All Endpoints

```bash
# 1. Register User
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "test123",
    "fullName": "Test User",
    "phone": "9876543210",
    "role": "USER"
  }'

# 2. Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
# Save the token from response

# 3. Get Products (via gateway)
curl http://localhost:8080/butchers/items/available \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Add to Cart
curl -X POST http://localhost:8080/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "meatItemId": 1,
    "butcherId": 1,
    "meatItemName": "Chicken Breast",
    "quantity": 2,
    "price": 280.00,
    "unit": "KG"
  }'

# 5. Get Cart
curl http://localhost:8080/cart \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Place Order
curl -X POST http://localhost:8080/orders/place \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "butcherId": 1,
    "deliveryAddress": "123 Test St, Mumbai",
    "deliveryPhone": "9876543210"
  }'

# 7. Get Orders
curl http://localhost:8080/orders/my \
  -H "Authorization: Bearer YOUR_TOKEN"

# 8. AI Chat
curl -X POST http://localhost:8080/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Track my order",
    "language": "en"
  }'
```

---

## ✅ SUCCESS CRITERIA

Your project is working correctly if:
- ✅ All 14 services start without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ Can register and login
- ✅ Products load on home page
- ✅ Can add items to cart
- ✅ Can place orders
- ✅ Order status updates live
- ✅ AI chat responds
- ✅ Subscriptions work
- ✅ No console errors in browser

---

## 📝 TESTING CHECKLIST

- [ ] Backend services start successfully
- [ ] Frontend starts successfully
- [ ] User registration works
- [ ] User login works
- [ ] Products display on home page
- [ ] Can add products to cart
- [ ] Can view cart
- [ ] Can place order
- [ ] Order appears in order history
- [ ] Live order tracking works
- [ ] AI chat responds
- [ ] Subscriptions can be created
- [ ] Profile page loads
- [ ] Addresses can be managed
- [ ] Butcher registration works
- [ ] Admin dashboard loads

---

**Happy Testing! 🚀**

