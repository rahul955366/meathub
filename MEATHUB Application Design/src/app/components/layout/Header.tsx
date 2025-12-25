// MEATHUB - Sticky Header Component

import React from 'react';
import { ShoppingCart, User, Menu, Heart } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onCategoryClick: (category: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, onCategoryClick, currentPage }: HeaderProps) {
  const { 
    currentUser, 
    isAuthenticated, 
    cart, 
    setShowAuthModal, 
    logout 
  } = useApp();

  const categories = [
    { id: 'CHICKEN', label: 'Chicken', page: 'category' },
    { id: 'MUTTON', label: 'Mutton', page: 'category' },
    { id: 'FISH', label: 'Fish', page: 'category' },
    { id: 'PRAWNS', label: 'Prawns', page: 'category' },
    { id: 'MARINATED', label: 'Marinated', page: 'category' },
    { id: 'gym', label: 'Gym', page: 'gym' },
    { id: 'pet', label: 'Pet', page: 'pet' },
    { id: 'b2b', label: 'B2B', page: 'b2b' }
  ];

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      onNavigate('profile');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      {/* Top Bar - Classic Elegant */}
      <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center text-xs font-medium tracking-wide">
        <p>Fresh meat delivered in 2 hours • Free delivery on orders above ₹500</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Classic Design */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                MEATHUB
              </h1>
              <p className="text-xs text-muted-foreground">Premium Quality Meat</p>
            </div>
          </div>

          {/* Desktop Navigation - Classic Clean */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.page === 'category') {
                    onNavigate('category', cat.id);
                  } else {
                    onNavigate(cat.page);
                  }
                }}
                className="text-sm font-medium text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
            >
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart - Classic Badge */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate('cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground font-medium"
                >
                  {cart.length}
                </Badge>
              )}
            </Button>

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="text-sm font-medium">{currentUser?.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('orders')}>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('subscriptions')}>
                    Subscriptions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                variant="luxury"
                className="shadow-lg"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-border overflow-x-auto">
        <div className="flex gap-4 px-4 py-3 min-w-max">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.page === 'category') {
                  onNavigate('category', cat.id);
                } else {
                  onNavigate(cat.page);
                }
              }}
              className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
