"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CartItem, MeatItem } from '../types';
import toast from 'react-hot-toast';

interface AppContextType {
    user: User | null;
    cart: CartItem[];
    searchQuery: string;
    token: string | null;
    setSearchQuery: (query: string) => void;
    addToCart: (item: MeatItem, selectedCut?: string) => void;
    removeFromCart: (id: number, selectedCut?: string) => void;
    clearCart: () => void;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    totalAmount: number;
    cartCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('meathub_token');
        const savedUser = localStorage.getItem('meathub_user');
        const savedCart = localStorage.getItem('meathub_cart');

        if (savedToken) setToken(savedToken);
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart data", e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('meathub_cart', JSON.stringify(cart));
    }, [cart]);

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('meathub_token', newToken);
        localStorage.setItem('meathub_user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('meathub_token');
        localStorage.removeItem('meathub_user');
        localStorage.removeItem('meathub_cart'); // Optional: clear cart on logout
        setCart([]);
    };

    const addToCart = (product: MeatItem, selectedCut: string = 'Curry Cut') => {
        // Multi-Butcher Restriction Removed
        // We now allow adding items from different butchers and split the order at checkout.

        setCart(prev => {
            // Find if item with same ID and Cut exists
            const existingIndex = prev.findIndex(item =>
                item.meat_item_id === product.id && item.selectedCut === selectedCut
            );

            if (existingIndex > -1) {
                const newCart = [...prev];
                newCart[existingIndex].quantity += 1;
                toast.success(`Increased ${product.name} quantity`);
                return newCart;
            }

            // Create new CartItem from MeatItem
            const newItem: CartItem = {
                id: Date.now(), // Generate a temporary unique ID for the cart entry
                meat_item_id: product.id,
                name: product.name,
                price: parseFloat(product.price), // Ensure number
                quantity: 1,
                image_url: product.image_url,
                butcher_id: product.butcher,
                category: product.category,
                selectedCut: selectedCut
            };

            toast.success(`Added ${product.name} to bag`);
            return [...prev, newItem];
        });
        setIsCartOpen(true); // Auto-open cart on add
    };

    const removeFromCart = (meatItemId: number, selectedCut?: string) => {
        setCart(prev => {
            if (selectedCut) {
                return prev.filter(item => !(item.meat_item_id === meatItemId && item.selectedCut === selectedCut));
            }
            return prev.filter(item => item.meat_item_id !== meatItemId);
        });
    };

    const clearCart = () => setCart([]);

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <AppContext.Provider value={{
            user, cart, searchQuery, token, isCartOpen,
            setIsCartOpen, setSearchQuery, addToCart, removeFromCart, clearCart,
            login, logout, totalAmount, cartCount
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
