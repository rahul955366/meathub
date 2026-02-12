"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
    category: string;
    selectedCut?: string;
}

interface AppContextType {
    user: User | null;
    cart: CartItem[];
    searchQuery: string;
    token: string | null;
    setSearchQuery: (query: string) => void;
    addToCart: (item: any) => void;
    removeFromCart: (id: number, selectedCut?: string) => void;
    clearCart: () => void;
    login: (token: string, userData: any) => void;
    logout: () => void;
    totalAmount: number;
    cartCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [token, setToken] = useState<string | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('meathub_token');
        const savedUser = localStorage.getItem('meathub_user');
        const savedCart = localStorage.getItem('meathub_cart');

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('meathub_cart', JSON.stringify(cart));
    }, [cart]);

    const login = (newToken: string, userData: any) => {
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
    };

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item =>
                item.id === product.id &&
                (item.selectedCut === product.selectedCut)
            );
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.selectedCut === product.selectedCut)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1, selectedCut: product.selectedCut || 'Curry Cut' }];
        });
    };

    const removeFromCart = (id: number, selectedCut?: string) => {
        setCart(prev => {
            if (selectedCut) {
                // Remove a specific item instance (id + selectedCut)
                const indexToRemove = prev.findIndex(item => item.id === id && item.selectedCut === selectedCut);
                if (indexToRemove > -1) {
                    const newCart = [...prev];
                    newCart.splice(indexToRemove, 1);
                    return newCart;
                }
                return prev; // Item not found
            } else {
                // Remove all items with the given id, regardless of selectedCut
                return prev.filter(item => item.id !== id);
            }
        });
    };

    const clearCart = () => setCart([]);

    const totalAmount = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <AppContext.Provider value={{
            user, cart, searchQuery, token,
            setSearchQuery, addToCart, removeFromCart, clearCart,
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
