// MEATHUB - Global Application Context
// Manages authentication, cart, orders, and user state

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CartItem, Order, Subscription, MeatProduct } from '../types';
import { authApi } from '../api/authApi';
import { googleAuthApi } from '../api/googleAuthApi';
import { profileApi, AddressResponse } from '../api/profileApi';
import { cartApi, CartResponse, CartItemResponse } from '../api/cartApi';
import { orderApi, OrderResponse } from '../api/orderApi';
import { subscriptionApi, SubscriptionResponse } from '../api/subscriptionApi';
import { productApi, MeatItemResponse } from '../api/productApi';
import { userApi } from '../api/userApi';
import {
  mapAuthResponseToUser,
  mapAddressResponse,
  mapOrderResponse,
  mapSubscriptionResponse,
  mapMeatItemToProduct
} from '../api/mappers';
import { toast } from 'sonner';

interface AppContextType {
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'USER' | 'BUTCHER') => Promise<boolean>;
  loginWithGoogle: (token: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, role: 'USER' | 'BUTCHER') => Promise<boolean>;

  // Butcher Selection
  selectedButcherId: number | null;
  setSelectedButcherId: (butcherId: number | null) => void;
  preferredButcherId: number | null;
  loadPreferredButcher: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Orders
  activeOrder: Order | null;
  orderHistory: Order[];
  placeOrder: (items: CartItem[], addressId: string, phoneNumber?: string) => Promise<Order>;

  // Subscriptions
  subscriptions: Subscription[];
  pauseSubscription: (subscriptionId: string) => void;
  resumeSubscription: (subscriptionId: string) => void;
  cancelSubscription: (subscriptionId: string) => void;

  // UI State
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showAIAssistant: boolean;
  setShowAIAssistant: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedButcherId, setSelectedButcherId] = useState<number | null>(null);
  const [preferredButcherId, setPreferredButcherId] = useState<number | null>(null);

  // Load user data (profile, addresses, cart, orders, subscriptions)
  const loadUserData = async (user: User) => {
    if (!user) return;

    try {
      // Load profile and addresses
      const [profile, addresses] = await Promise.all([
        profileApi.getProfile().catch(() => null),
        profileApi.getAddresses().catch(() => []),
      ]);

      if (profile) {
        setCurrentUser(prev => prev ? {
          ...prev,
          name: profile.fullName,
          email: profile.email,
          phone: profile.phone || '',
          addresses: addresses.map(mapAddressResponse),
        } : null);
      }

      // Load cart (only for USER role)
      try {
        const cartData = await cartApi.getCart();
        await loadCartFromBackend(cartData);
      } catch (error) {
        console.error('Failed to load cart:', error);
        // Create empty cart if backend fails
      }

      // Load preferred butcher (only if authenticated)
      if (user.role === 'USER') {
        try {
          const preferredId = await userApi.getPreferredButcher();
          if (preferredId) {
            setPreferredButcherId(preferredId);
            setSelectedButcherId(preferredId);
          }
        } catch (error) {
          // Silently fail - user might not be authenticated or have no preferred butcher
          console.debug('No preferred butcher found or not authenticated');
        }
      }

      // Load orders and subscriptions
      if (user.role === 'USER') {
        loadOrders(user);
        loadSubscriptions();
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Load cart from backend response
  const loadCartFromBackend = async (cartData: CartResponse) => {
    // Fetch products for cart items
    const cartItems: CartItem[] = [];

    for (const item of cartData.items) {
      try {
        // We need to get product details - for now create minimal product
        const product: MeatProduct = {
          id: item.meatItemId.toString(),
          name: item.meatItemName,
          category: 'CHICKEN', // Default, would need to fetch actual product
          cutType: '',
          description: '',
          price: item.price,
          unit: item.unit || 'KG',
          imageUrl: '',
          inStock: true,
          tags: [],
        };

        cartItems.push({
          product: {
            ...product,
            butcherId: item.butcherId,
            butcherName: undefined, // Would need to fetch butcher name separately
          },
          quantity: item.quantity,
          butcherId: item.butcherId,
        });
      } catch (error) {
        console.error('Failed to load cart item:', error);
      }
    }

    setCart(cartItems);
  };

  // Load orders
  const loadOrders = async (user?: User) => {
    try {
      const userToUse = user || currentUser;
      if (!userToUse) return;

      const addresses = userToUse.addresses || [];
      const orders = await orderApi.getMyOrders();
      const mappedOrders = orders.map(order => mapOrderResponse(order, addresses));

      // Find active order (not delivered/cancelled)
      const active = mappedOrders.find(o =>
        !['DELIVERED', 'CANCELLED'].includes(o.status)
      ) || null;

      setActiveOrder(active);
      setOrderHistory(mappedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  // Load subscriptions
  const loadSubscriptions = async () => {
    try {
      const subs = await subscriptionApi.getMySubscriptions();
      const products: MeatProduct[] = []; // Would need to fetch products
      const mapped = subs.map(sub => mapSubscriptionResponse(sub, products));
      setSubscriptions(mapped);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  };

  // Load persisted token and initialize
  useEffect(() => {
    const token = localStorage.getItem('meathub_token');
    const savedUser = localStorage.getItem('meathub_user');

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        // Load user data from API
        loadUserData(user);
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        localStorage.removeItem('meathub_token');
        localStorage.removeItem('meathub_user');
      }
    }
  }, []);

  // Load data when user changes
  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser);
    } else {
      setCart([]);
      setActiveOrder(null);
      setOrderHistory([]);
      setSubscriptions([]);
    }
  }, [currentUser?.id]); // Only reload if user ID changes

  // Listen for address updates
  useEffect(() => {
    const handleAddressUpdate = async () => {
      if (currentUser) {
        try {
          const addresses = await profileApi.getAddresses();
          setCurrentUser(prev => prev ? {
            ...prev,
            addresses: addresses.map(mapAddressResponse),
          } : null);
        } catch (error) {
          console.error('Failed to reload addresses:', error);
        }
      }
    };

    window.addEventListener('addressUpdated', handleAddressUpdate);
    return () => window.removeEventListener('addressUpdated', handleAddressUpdate);
  }, [currentUser]);

  const login = async (email: string, password: string, role: 'USER' | 'BUTCHER'): Promise<boolean> => {
    try {
      // Use email as username for login (backend expects username)
      const authResponse = await authApi.login({
        username: email,
        password,
      });

      // Store token
      localStorage.setItem('meathub_token', authResponse.token);

      // Load profile and addresses to build complete user object
      let addresses: AddressResponse[] = [];
      try {
        addresses = await profileApi.getAddresses();
      } catch (error) {
        console.warn('Failed to load addresses:', error);
      }

      const user = mapAuthResponseToUser(authResponse, addresses);

      // Check if butcher and load approval status
      if (user.role === 'BUTCHER') {
        try {
          const butcherApiModule = await import('../api/butcherApi');
          const butcherProfile = await butcherApiModule.butcherApi.getMyProfile();
          user.isApproved = butcherProfile.status === 'APPROVED';
          user.approvalStatus = butcherProfile.status as 'PENDING' | 'APPROVED' | 'REJECTED';
        } catch (error) {
          console.warn('Failed to load butcher profile:', error);
          user.approvalStatus = 'PENDING';
        }
      }

      setCurrentUser(user);
      localStorage.setItem('meathub_user', JSON.stringify(user));
      setShowAuthModal(false);

      // Load user data after login
      loadUserData(user);

      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const loginWithGoogle = async (token: string): Promise<boolean> => {
    try {
      // Send Google token to backend for verification
      const authResponse = await googleAuthApi.loginWithGoogle(token);

      // Store token
      localStorage.setItem('meathub_token', authResponse.token);

      // Load profile and addresses to build complete user object
      let addresses: AddressResponse[] = [];
      try {
        addresses = await profileApi.getAddresses();
      } catch (error) {
        console.warn('Failed to load addresses:', error);
      }

      const user = mapAuthResponseToUser(authResponse, addresses);

      setCurrentUser(user);
      localStorage.setItem('meathub_user', JSON.stringify(user));
      setShowAuthModal(false);

      // Load user data after login
      loadUserData(user);

      toast.success('Google login successful!');
      return true;
    } catch (error: any) {
      console.error('Google login failed:', error);
      toast.error(error.message || 'Google login failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('meathub_token');
    localStorage.removeItem('meathub_user');
    setCurrentUser(null);
    setCart([]);
    setActiveOrder(null);
    setSubscriptions([]);
    setOrderHistory([]);
    toast.success('Logged out successfully');
  };

  const register = async (userData: Partial<User>, role: 'USER' | 'BUTCHER'): Promise<boolean> => {
    try {
      if (!userData.email || !userData.name || !userData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Generate username from email (backend requires username)
      const username = userData.email.split('@')[0];

      const authResponse = await authApi.register({
        username,
        email: userData.email,
        password: userData.phone, // In real app, user would provide password
        fullName: userData.name,
        phone: userData.phone.replace(/\D/g, ''), // Remove non-digits
        role: role,
      });

      // Store token
      localStorage.setItem('meathub_token', authResponse.token);

      const user = mapAuthResponseToUser(authResponse, []);

      // If butcher, they need to onboard first
      if (role === 'BUTCHER') {
        user.approvalStatus = 'PENDING';
        user.isApproved = false;
      }

      setCurrentUser(user);
      localStorage.setItem('meathub_user', JSON.stringify(user));
      setShowAuthModal(false);

      // Load user data after registration
      loadUserData(user);

      if (role === 'BUTCHER') {
        toast.info('Registration successful! Please complete your business onboarding.');
      } else {
        toast.success('Registration successful!');
      }
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      return false;
    }
  };

  const addToCart = async (item: CartItem) => {
    if (!currentUser || currentUser.role !== 'USER') {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      // Extract butcherId from CartItem or product
      const butcherId = item.butcherId || (item.product as any).butcherId;
      if (!butcherId) {
        throw new Error('Butcher ID is required. Please select a butcher first.');
      }
      
      // Validate and prepare request data
      const meatItemId = parseInt(item.product.id);
      if (isNaN(meatItemId)) {
        throw new Error('Invalid product ID');
      }
      
      const quantity = item.quantity || 0.5;
      // Allow decimal quantities (0.5, 0.25, etc.) - minimum 0.01
      if (quantity < 0.01) {
        throw new Error('Quantity must be at least 0.01');
      }
      
      const price = Number(item.product.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Invalid product price');
      }

      await cartApi.addToCart({
        meatItemId,
        butcherId,
        meatItemName: item.product.name || 'Unknown Product',
        quantity,
        price,
        unit: item.product.unit || 'KG',
      });

      // Reload cart from backend
      const cartData = await cartApi.getCart();
      await loadCartFromBackend(cartData);

      toast.success('Item added to cart');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      // Extract error message properly - check multiple possible locations
      const errorMessage = error?.message || error?.error || (error?.errors ? JSON.stringify(error.errors) : null) || 'Failed to add item to cart';
      toast.error(errorMessage);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!currentUser) return;

    try {
      // Find cart item ID from backend cart
      const cartData = await cartApi.getCart();
      const cartItem = cartData.items.find(item => item.meatItemId.toString() === productId);

      if (cartItem) {
        await cartApi.removeFromCart(cartItem.id);
        // Reload cart
        const updatedCart = await cartApi.getCart();
        await loadCartFromBackend(updatedCart);
        toast.success('Item removed from cart');
      }
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      toast.error(error.message || 'Failed to remove item from cart');
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!currentUser) return;

    // Round to 2 decimal places to avoid floating point issues
    const roundedQuantity = Math.round(quantity * 100) / 100;

    // If quantity is 0 or less, remove the item (like Amazon/Flipkart)
    if (roundedQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    // Ensure minimum quantity is 0.01 (backend validation)
    if (roundedQuantity < 0.01) {
      await removeFromCart(productId);
      return;
    }

    try {
      // Get current cart from backend to find the cart item ID
      const cartData = await cartApi.getCart();
      const backendCartItem = cartData.items.find(item => item.meatItemId.toString() === productId);
      
      if (!backendCartItem) {
        toast.error('Item not found in cart');
        return;
      }

      // Use the new update endpoint (like Amazon/Flipkart) - updates in place, preserves order
      // Backend handles removal if quantity <= 0
      const updatedCart = await cartApi.updateItemQuantity(backendCartItem.id, roundedQuantity);
      
      // Reload cart from backend response (order is preserved)
      await loadCartFromBackend(updatedCart);
      
      // No toast for quantity updates to avoid spam (like e-commerce sites)
    } catch (error: any) {
      console.error('Failed to update cart quantity:', error);
      // Extract error message properly - check multiple possible locations
      const errorMessage = error?.message || error?.error || (error?.errors ? JSON.stringify(error.errors) : null) || 'Failed to update quantity';
      toast.error(errorMessage);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;

    try {
      // Remove all items from cart
      const cartData = await cartApi.getCart();
      for (const item of cartData.items) {
        await cartApi.removeFromCart(item.id);
      }
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setCart([]); // Clear locally anyway
    }
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const placeOrder = async (items: CartItem[], addressId: string, phoneNumber?: string): Promise<Order> => {
    if (!currentUser) {
      throw new Error('Please login to place an order');
    }

    try {
      const address = currentUser.addresses.find(a => a.id === addressId);
      if (!address) {
        throw new Error('Please select a delivery address');
      }

      // Get butcher ID from first item (in real app, all items should be from same butcher)
      const butcherId = (items[0]?.product as any).butcherId || 1;

      // Build delivery address string
      const deliveryAddress = `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.pincode}`;

      // Get phone number - prioritize passed parameter, then user's phone, then fetch from profile
      let deliveryPhone = phoneNumber || currentUser.phone;
      
      // If phone is still not set, try to get it from profile
      if (!deliveryPhone || deliveryPhone.trim() === '') {
        try {
          const profile = await profileApi.getProfile();
          deliveryPhone = profile.phone || '';
        } catch (error) {
          console.warn('Failed to load profile for phone:', error);
        }
      }
      
      // Final validation - phone is required
      if (!deliveryPhone || deliveryPhone.trim() === '') {
        throw new Error('Delivery phone number is required. Please update your phone number in your profile.');
      }

      console.log('Placing order with:', { butcherId, deliveryAddress, deliveryPhone });

      const orderResponse = await orderApi.placeOrder({
        butcherId,
        deliveryAddress,
        deliveryPhone: deliveryPhone.trim(),
      });

      const mappedOrder = mapOrderResponse(orderResponse, currentUser.addresses);

      setActiveOrder(mappedOrder);
      setOrderHistory(prev => [mappedOrder, ...prev]);
      await clearCart();

      // Reload orders from backend to ensure we have the latest data
      await loadOrders(currentUser);

      toast.success('Order placed successfully!');
      return mappedOrder;
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error.message || 'Failed to place order');
      throw error;
    }
  };

  const pauseSubscription = async (subscriptionId: string) => {
    try {
      await subscriptionApi.pauseSubscription(parseInt(subscriptionId));
      await loadSubscriptions();
      toast.success('Subscription paused');
    } catch (error: any) {
      console.error('Failed to pause subscription:', error);
      toast.error(error.message || 'Failed to pause subscription');
    }
  };

  const resumeSubscription = async (subscriptionId: string) => {
    try {
      await subscriptionApi.resumeSubscription(parseInt(subscriptionId));
      await loadSubscriptions();
      toast.success('Subscription resumed');
    } catch (error: any) {
      console.error('Failed to resume subscription:', error);
      toast.error(error.message || 'Failed to resume subscription');
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      // Note: Backend may not have cancel endpoint, using pause for now
      // If cancel endpoint exists, add it to subscriptionApi
      await subscriptionApi.pauseSubscription(parseInt(subscriptionId));
      await loadSubscriptions();
      toast.success('Subscription cancelled');
    } catch (error: any) {
      console.error('Failed to cancel subscription:', error);
      toast.error(error.message || 'Failed to cancel subscription');
    }
  };

  const loadPreferredButcher = async () => {
    if (!currentUser || currentUser.role !== 'USER') return;
    try {
      const preferredId = await userApi.getPreferredButcher();
      setPreferredButcherId(preferredId);
      if (preferredId) {
        setSelectedButcherId(preferredId);
      }
    } catch (error) {
      console.error('Failed to load preferred butcher:', error);
    }
  };

  const value: AppContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    loginWithGoogle,
    logout,
    register,
    selectedButcherId,
    setSelectedButcherId,
    preferredButcherId,
    loadPreferredButcher,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    activeOrder,
    orderHistory,
    placeOrder,
    subscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    showAuthModal,
    setShowAuthModal,
    showAIAssistant,
    setShowAIAssistant
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
