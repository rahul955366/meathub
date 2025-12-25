// MEATHUB - Main Application Component

import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider, useApp } from '../context/AppContext';
import { Header } from './components/layout/Header';
import { AuthModal } from './components/auth/AuthModal';
import { AIAssistant } from './components/ai/AIAssistant';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { ButcherDashboard } from './pages/ButcherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { PaymentPage } from './pages/PaymentPage';
import { CategoryPage } from './pages/CategoryPage';
import { ButcherSelectionPage } from './pages/ButcherSelectionPage';
import { ButcherItemsPage } from './pages/ButcherItemsPage';
import { PetPage } from './pages/PetPage';
import { GymPage } from './pages/GymPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'cart' | 'profile' | 'orders' | 'subscriptions' | 'product-detail' | 'order-detail' | 'category' | 'gym' | 'pet' | 'b2b' | 'payment' | 'butcher-selection' | 'butcher-items';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);
  const { currentUser, setSelectedButcherId } = useApp();

  const handleButcherSelected = (butcherId: number) => {
    setSelectedButcherId(butcherId);
  };

  useEffect(() => {
    // Handle role-based routing
    if (currentUser) {
      if (currentUser.role === 'BUTCHER') {
        setCurrentPage('butcher-dashboard' as Page);
      } else if (currentUser.role === 'ADMIN') {
        setCurrentPage('admin-dashboard' as Page);
      }
    }
  }, [currentUser]);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as Page);
    setPageData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryId: string) => {
    // Use global function to scroll to category
    if ((window as any).scrollToCategory) {
      (window as any).scrollToCategory(categoryId);
    }
  };

  // Render dashboard for Butcher/Admin
  if (currentUser?.role === 'BUTCHER') {
    return (
      <div className="min-h-screen bg-background">
        <ButcherDashboard onNavigate={handleNavigate} />
        <Toaster />
      </div>
    );
  }

  if (currentUser?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-background">
        <AdminDashboard onNavigate={handleNavigate} />
        <Toaster />
      </div>
    );
  }

  // Render public/user pages
  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigate={handleNavigate}
        onCategoryClick={handleCategoryClick}
        currentPage={currentPage}
      />

      <main>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
        {currentPage === 'orders' && <ProfilePage onNavigate={handleNavigate} />}
        {currentPage === 'subscriptions' && (
          <SubscriptionPage 
            onNavigate={handleNavigate} 
            product={pageData?.product || pageData} 
            period={pageData?.period}
          />
        )}
        {currentPage === 'payment' && pageData && (
          <PaymentPage
            onNavigate={handleNavigate}
            orderId={pageData.orderId}
            subscriptionId={pageData.subscriptionId}
            amount={pageData.amount}
            type={pageData.type}
            description={pageData.description}
            cartItems={pageData.cartItems}
            addressId={pageData.addressId}
            deliveryPhone={pageData.deliveryPhone}
          />
        )}

        {/* Category Page */}
        {currentPage === 'category' && pageData && (
          <CategoryPage categoryId={pageData} onNavigate={handleNavigate} />
        )}

        {/* Butcher Selection Page */}
        {currentPage === 'butcher-selection' && (
          <ButcherSelectionPage 
            onNavigate={handleNavigate} 
            onButcherSelected={handleButcherSelected}
          />
        )}

        {/* Butcher Items Page */}
        {currentPage === 'butcher-items' && pageData && (
          <ButcherItemsPage butcherId={pageData} onNavigate={handleNavigate} />
        )}

        {/* Pet Page */}
        {currentPage === 'pet' && (
          <PetPage onNavigate={handleNavigate} />
        )}

        {/* Gym Page */}
        {currentPage === 'gym' && (
          <GymPage onNavigate={handleNavigate} />
        )}

        {/* Product Detail Page */}
        {currentPage === 'product-detail' && pageData && (
          <ProductDetailPage product={pageData} onNavigate={handleNavigate} />
        )}

        {currentPage === 'order-detail' && pageData && (
          <OrderDetailPage 
            onNavigate={handleNavigate} 
            orderId={typeof pageData === 'object' && pageData.id ? pageData.id : parseInt(pageData)}
          />
        )}

        {/* Legacy order-detail fallback */}
        {currentPage === 'order-detail' && !pageData && (
          <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-primary mb-4 hover:underline"
                >
                  ← Back to Home
                </button>
                <h1 className="text-3xl font-semibold mb-4">Order Details</h1>
                <p className="text-muted-foreground">
                  Complete order tracking with live updates, videos, and delivery information.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'gym' && (
          <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-primary mb-4 hover:underline"
                >
                  ← Back to Home
                </button>
                <h1 className="text-3xl font-semibold mb-4">Gym & Fitness Plans</h1>
                <p className="text-muted-foreground">
                  Daily protein plans with fixed quantities and subscription options.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'pet' && (
          <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-primary mb-4 hover:underline"
                >
                  ← Back to Home
                </button>
                <h1 className="text-3xl font-semibold mb-4">Pet Food</h1>
                <p className="text-muted-foreground">
                  Fresh, nutritious meat products for your pets with subscription options.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'b2b' && (
          <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-primary mb-4 hover:underline"
                >
                  ← Back to Home
                </button>
                <h1 className="text-3xl font-semibold mb-4">B2B Solutions</h1>
                <p className="text-muted-foreground">
                  Bulk ordering for restaurants, hostels, PGs, and hotels with special pricing.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Components */}
      <AuthModal />
      <AIAssistant />
      <Toaster />
    </div>
  );
}

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </GoogleOAuthProvider>
  );
}