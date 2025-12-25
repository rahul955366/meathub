// MEATHUB - Cart Page

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Tag,
  ArrowRight,
  PackageCheck,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface CartPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal,
    currentUser,
    isAuthenticated,
    setShowAuthModal,
    placeOrder,
    selectedButcherId,
    clearCart
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showChangeButcherDialog, setShowChangeButcherDialog] = useState(false);

  // Get butcherId from cart items or selectedButcherId
  const cartButcherId = cart.length > 0 
    ? (cart[0].butcherId || cart[0].product?.butcherId || selectedButcherId)
    : selectedButcherId;

  const deliveryCharge = cartTotal > 500 ? 0 : 40;
  const packagingCharge = 20;
  const finalTotal = cartTotal + deliveryCharge + packagingCharge - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FIRST10') {
      const discountAmount = cartTotal * 0.1;
      setDiscount(discountAmount);
      toast.success('Promo code applied! You saved ₹' + discountAmount.toFixed(2));
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.info('Please login to place order');
      return;
    }

    if (!currentUser?.addresses || currentUser.addresses.length === 0) {
      toast.error('Please add a delivery address first');
      onNavigate('profile');
      return;
    }

    // Validate phone number before proceeding
    if (!currentUser.phone || currentUser.phone.trim() === '') {
      toast.error('Please update your phone number in your profile before placing an order');
      onNavigate('profile');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Navigate to payment page first
      // Order will be created after successful payment
      onNavigate('payment', {
        amount: finalTotal,
        type: 'order',
        description: `Order - ${cart.length} item(s)`,
        cartItems: cart,
        addressId: currentUser.addresses[0].id,
        deliveryPhone: currentUser.phone,
      });
    } catch (error) {
      toast.error('Failed to proceed to payment. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground">
                Add some fresh meat to get started
              </p>
            </div>
            <Button 
              size="lg"
              onClick={() => onNavigate('home')}
              className="bg-primary hover:bg-primary-dark"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

          {/* Selected Butcher Info */}
          {cartButcherId && (
            <Card className="p-4 mb-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ordering from</p>
                  <p className="font-semibold">
                    {cart[0]?.product?.butcherName || `Butcher ID: ${cartButcherId}`}
                  </p>
                </div>
                <Badge variant="outline">Single Butcher Order</Badge>
              </div>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.product.id} className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.cutType} • {item.product.category}
                          </p>
                          {item.product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.product.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            removeFromCart(item.product.id);
                            toast.success('Item removed from cart');
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 0.5)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-16 text-center">
                            {item.quantity} {item.product.unit}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 0.5)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{item.product.price} / {item.product.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Promo Code */}
              <Card className="p-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleApplyPromo}
                    variant="outline"
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Try: FIRST10 for 10% off
                </p>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                    <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Packaging Charge</span>
                    <span className="font-medium">₹{packagingCharge.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium text-green-600">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-lg text-primary">
                      ₹{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={isPlacingOrder}
                  className="w-full mt-6 bg-primary hover:bg-primary-dark"
                  size="lg"
                >
                  {isPlacingOrder ? (
                    'Processing...'
                  ) : (
                    <>
                      <PackageCheck className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>

                {cartTotal < 500 && (
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Add ₹{(500 - cartTotal).toFixed(2)} more for free delivery
                  </p>
                )}

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t space-y-2">
                  <p className="text-sm font-medium mb-2">Why order with us?</p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>✓ Fresh meat cut after order</p>
                    <p>✓ Video proof of cutting & packing</p>
                    <p>✓ Delivered in 2 hours</p>
                    <p>✓ 100% quality guarantee</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Change Butcher Dialog */}
      <AlertDialog open={showChangeButcherDialog} onOpenChange={setShowChangeButcherDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Change Butcher?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Changing butcher will clear your current cart. All items from the current butcher
              will be removed. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearCart();
                setShowChangeButcherDialog(false);
                onNavigate('butcher-selection');
                toast.info('Cart cleared. Please select a new butcher.');
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Clear Cart & Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
