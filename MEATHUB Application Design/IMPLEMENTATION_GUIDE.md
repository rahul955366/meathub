# MEATHUB - Implementation & Integration Guide

## 🎯 Quick Start

### Testing the Application

1. **Home Page (Public Access)**
   - Browse all product categories
   - View product cards with pricing
   - Click on products to view details
   - Add items to cart

2. **Authentication Flow**
   - Click "Login" button in header
   - Select role: USER or BUTCHER
   - Use demo credentials or register new account
   - Butcher registration requires admin approval

3. **User Experience**
   - Add products to cart
   - View cart and update quantities
   - Apply promo code: `FIRST10` for 10% off
   - Place order (requires login)
   - View live order tracking on home page
   - Interact with AI Assistant (floating button)

4. **Butcher Experience**
   - Login as butcher: `ali@meathub.com`
   - View orders dashboard
   - Update order status
   - Upload videos (simulated)
   - View sales statistics

5. **Admin Experience**
   - Login as admin: `admin@meathub.com`
   - View complete analytics
   - Approve pending butchers
   - Monitor subscriptions
   - View charts and statistics

## 🏗️ Application Flow

### Customer Journey

```
1. Browse Home → Select Product → View Details
                                 ↓
2. Add to Cart → Update Quantity → Apply Promo
                                 ↓
3. Login/Register → Select Address → Place Order
                                 ↓
4. Live Tracking → Watch Videos → Receive Delivery
                                 ↓
5. Manage Subscriptions → Pause/Resume → Auto Deliveries
```

### Butcher Journey

```
1. Register → Pending Approval → Admin Reviews
                                 ↓
2. Login → View Dashboard → See Assigned Orders
                                 ↓
3. Update Status: Cutting → Upload Video → Mark as Packed
                                 ↓
4. View Analytics → Daily Stats → Weekly/Monthly Reports
```

### Admin Journey

```
1. Login → View Dashboard → Complete Overview
                                 ↓
2. Manage Approvals → Approve/Reject Butchers
                                 ↓
3. Monitor Operations → View Charts → Track Performance
                                 ↓
4. User Management → Subscription Management → System Health
```

## 🔌 API Integration Points

### 1. Authentication Service

**Endpoints to implement:**
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/google
POST /api/auth/logout
GET  /api/auth/verify
```

**Replace in:** `/src/context/AppContext.tsx`
- `login()` function
- `register()` function
- `logout()` function

### 2. Product Service

**Endpoints to implement:**
```typescript
GET  /api/products?category=CHICKEN
GET  /api/products/:id
POST /api/products (admin only)
PUT  /api/products/:id (admin only)
```

**Replace in:** `/src/data/mockData.ts`
- Import products from API
- Real-time stock updates

### 3. Cart Service

**Endpoints to implement:**
```typescript
GET  /api/cart
POST /api/cart/add
PUT  /api/cart/update/:itemId
DELETE /api/cart/remove/:itemId
```

**Replace in:** `/src/context/AppContext.tsx`
- `addToCart()` function
- `updateCartQuantity()` function
- `removeFromCart()` function

### 4. Order Service

**Endpoints to implement:**
```typescript
POST /api/orders
GET  /api/orders/:id
GET  /api/orders/user/:userId
PUT  /api/orders/:id/status (butcher only)
GET  /api/orders/active (user specific)
```

**Replace in:** `/src/context/AppContext.tsx`
- `placeOrder()` function
- Add real-time order tracking

### 5. Video Service

**Endpoints to implement:**
```typescript
POST /api/videos/upload
GET  /api/videos/order/:orderId
GET  /api/videos/:id/stream
```

**Integration points:**
- Butcher dashboard video upload
- Order tracking video display
- Profile page video history

### 6. Subscription Service

**Endpoints to implement:**
```typescript
POST /api/subscriptions
GET  /api/subscriptions/user/:userId
PUT  /api/subscriptions/:id/pause
PUT  /api/subscriptions/:id/resume
DELETE /api/subscriptions/:id
```

**Replace in:** `/src/context/AppContext.tsx`
- `pauseSubscription()` function
- `resumeSubscription()` function
- `cancelSubscription()` function

### 7. AI Assistant Service

**Endpoints to implement:**
```typescript
POST /api/ai/chat
POST /api/ai/action
GET  /api/ai/suggestions
```

**Replace in:** `/src/app/components/ai/AIAssistant.tsx`
- `handleSendMessage()` function
- `generateAIResponse()` function

### 8. Analytics Service

**Endpoints to implement:**
```typescript
GET /api/analytics/admin
GET /api/analytics/butcher/:butcherId
GET /api/analytics/revenue
GET /api/analytics/orders
```

**Integration points:**
- Admin dashboard charts
- Butcher dashboard statistics

## 🔐 Security Implementation

### 1. Authentication Flow

```typescript
// Add to App.tsx or create AuthProvider
const token = localStorage.getItem('auth_token');

// Add to all API calls
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### 2. Protected Routes

```typescript
// Add route guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useApp();
  
  if (!currentUser) return <Redirect to="/login" />;
  if (!allowedRoles.includes(currentUser.role)) return <Redirect to="/" />;
  
  return children;
};
```

### 3. API Error Handling

```typescript
// Add global error handler
const apiCall = async (endpoint: string, options: RequestInit) => {
  try {
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to login
        logout();
      }
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    toast.error('Something went wrong');
    throw error;
  }
};
```

## 🎨 Customization Guide

### 1. Branding

**Logo:** Replace in `/src/app/components/layout/Header.tsx`
```tsx
// Current placeholder
<div className="w-10 h-10 bg-primary rounded-lg">
  <span className="text-primary-foreground">M</span>
</div>

// Replace with
<img src="/logo.png" alt="MEATHUB" className="w-10 h-10" />
```

**Colors:** Edit `/src/styles/theme.css`
```css
:root {
  --primary: #YourColor;
  --secondary: #YourColor;
  /* ... etc */
}
```

### 2. Adding New Categories

1. **Add to types:** `/src/types/index.ts`
```typescript
export type MeatCategory = 
  | 'CHICKEN' 
  | 'YOUR_NEW_CATEGORY';
```

2. **Add products:** `/src/data/mockData.ts`
```typescript
export const yourCategoryProducts: MeatProduct[] = [
  // ... your products
];
```

3. **Add to navigation:** `/src/app/components/layout/Header.tsx`
```typescript
const categories = [
  // ... existing
  { id: 'your-category', label: 'Your Category' }
];
```

4. **Add section to home:** `/src/app/pages/HomePage.tsx`
```tsx
<section ref={yourCategoryRef}>
  {/* Your category section */}
</section>
```

### 3. Payment Integration

**Example: Razorpay Integration**

```typescript
// Install Razorpay
npm install razorpay

// In CartPage.tsx
const handlePayment = async () => {
  const options = {
    key: process.env.VITE_RAZORPAY_KEY,
    amount: finalTotal * 100, // paise
    currency: 'INR',
    name: 'MEATHUB',
    description: 'Order Payment',
    handler: async (response) => {
      // Verify payment on backend
      await placeOrder(cart, addressId, response.razorpay_payment_id);
    }
  };
  
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

### 4. Real-time Updates

**Example: WebSocket Integration**

```typescript
// Create WebSocket hook
const useOrderTracking = (orderId: string) => {
  const [status, setStatus] = useState<OrderStatus>('PLACED');
  
  useEffect(() => {
    const ws = new WebSocket(`wss://api.meathub.com/orders/${orderId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);
    };
    
    return () => ws.close();
  }, [orderId]);
  
  return status;
};
```

## 📱 Mobile App Conversion

The codebase is ready for conversion to React Native:

1. **Reusable Logic**
   - All business logic in `/src/context/AppContext.tsx`
   - All types in `/src/types/index.ts`
   - All mock data in `/src/data/mockData.ts`

2. **UI Components**
   - Replace Radix UI with React Native Paper or Native Base
   - Convert Tailwind classes to StyleSheet

3. **Navigation**
   - Replace page state with React Navigation
   - Keep same navigation structure

## 🧪 Testing

### Unit Tests (To be added)

```typescript
// Example: Cart functionality
describe('Cart Management', () => {
  it('should add item to cart', () => {
    const { addToCart, cart } = useApp();
    addToCart({ product: mockProduct, quantity: 1 });
    expect(cart.length).toBe(1);
  });
});
```

### Integration Tests

```typescript
// Example: Order flow
describe('Order Flow', () => {
  it('should complete full order journey', async () => {
    // Add to cart
    // Proceed to checkout
    // Place order
    // Verify order created
  });
});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
# Output: dist/
```

### Environment Variables

```env
# Production
VITE_API_GATEWAY_URL=https://api.meathub.com
VITE_ENV=production

# Staging
VITE_API_GATEWAY_URL=https://staging-api.meathub.com
VITE_ENV=staging
```

### Deploy to Vercel/Netlify

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

## 📊 Monitoring

### Analytics Integration

```typescript
// Add to App.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <AppProvider>
        <AppContent />
      </AppProvider>
      <Analytics />
    </>
  );
}
```

### Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## 🎯 Performance Optimization

1. **Code Splitting**
   - Already implemented with React.lazy
   - Split by routes/pages

2. **Image Optimization**
   - Use Next.js Image component
   - Or implement lazy loading

3. **API Caching**
   - Implement React Query
   - Cache product data

4. **Bundle Size**
   - Current size is optimized
   - Tree-shaking enabled

## 📞 Support

For questions or integration help:
- Technical Documentation: See inline code comments
- Type Definitions: Check `/src/types/index.ts`
- Mock Data Format: See `/src/data/mockData.ts`

---

**Ready for production integration with your 14-microservice backend!**
