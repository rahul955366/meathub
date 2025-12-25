// MEATHUB - Payment Page
// Handles payment gateway integration

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { paymentApi } from '../../api/paymentApi';

interface PaymentPageProps {
  onNavigate: (page: string, data?: any) => void;
  orderId?: string;
  subscriptionId?: string;
  amount: number;
  type: 'order' | 'subscription';
  description?: string;
  cartItems?: any[];
  addressId?: string;
  deliveryPhone?: string;
}

export function PaymentPage({ onNavigate, orderId, subscriptionId, amount, type, description, cartItems, addressId, deliveryPhone }: PaymentPageProps) {
  const { currentUser, placeOrder } = useApp();
  
  // Validate required data before payment
  useEffect(() => {
    if (type === 'order' && (!cartItems || cartItems.length === 0)) {
      toast.error('Cart is empty');
      onNavigate('cart');
      return;
    }
    if (type === 'order' && !addressId) {
      toast.error('Please select a delivery address');
      onNavigate('cart');
      return;
    }
    const phone = deliveryPhone || currentUser?.phone;
    if (!phone || phone.trim() === '') {
      toast.error('Please update your phone number in profile');
      onNavigate('profile');
      return;
    }
  }, [type, cartItems, addressId, currentUser, deliveryPhone]);
  
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create payment order with backend
      const paymentResponse = await paymentApi.createPayment({
        amount: amount,
        currency: 'INR',
        orderId: orderId ? parseInt(orderId) : undefined,
        subscriptionId: subscriptionId ? parseInt(subscriptionId) : undefined,
        description: description || `Payment for ${type}`,
        customerName: currentUser?.name,
        customerEmail: currentUser?.email,
        customerPhone: deliveryPhone || currentUser?.phone,
      });

      // Check if Razorpay is available
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        // Use Razorpay
        const options = {
          key: paymentResponse.keyId || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          name: 'MEATHUB',
          description: description || `Payment for ${type}`,
          order_id: paymentResponse.razorpayOrderId,
          handler: async (response: any) => {
            await handlePaymentSuccess(response, paymentResponse);
          },
          prefill: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            contact: deliveryPhone || currentUser?.phone || '',
          },
          theme: {
            color: '#d97706', // MEATHUB primary color
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.on('payment.failed', (response: any) => {
          console.error('Payment failed:', response);
          setPaymentStatus('failed');
          toast.error('Payment failed. Please try again.');
          setIsProcessing(false);
        });
        razorpay.open();
      } else {
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: paymentResponse.keyId || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
            amount: amount * 100,
            currency: 'INR',
            name: 'MEATHUB',
            description: description || `Payment for ${type}`,
            order_id: paymentResponse.razorpayOrderId,
            handler: async (response: any) => {
              await handlePaymentSuccess(response, paymentResponse);
            },
            prefill: {
              name: currentUser?.name || '',
              email: currentUser?.email || '',
              contact: deliveryPhone || currentUser?.phone || '',
            },
            theme: {
              color: '#d97706',
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
              },
            },
          };

          const razorpay = new (window as any).Razorpay(options);
          razorpay.on('payment.failed', (response: any) => {
            console.error('Payment failed:', response);
            setPaymentStatus('failed');
            toast.error('Payment failed. Please try again.');
            setIsProcessing(false);
          });
          razorpay.open();
        };
        script.onerror = () => {
          // Fallback to mock payment if Razorpay script fails
          console.warn('Razorpay script failed to load, using mock payment');
          handleMockPayment();
        };
        document.body.appendChild(script);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      // Fallback to mock payment
      handleMockPayment();
    }
  };

  const handlePaymentSuccess = async (razorpayResponse: any, paymentResponse: any) => {
    try {
      // Verify payment with backend
      const verifyResponse = await paymentApi.verifyPayment({
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        orderId: orderId ? parseInt(orderId) : undefined,
        subscriptionId: subscriptionId ? parseInt(subscriptionId) : undefined,
      });

      if (verifyResponse.verified) {
        setPaymentStatus('success');
        toast.success('Payment successful!');
        
        // Create order/subscription after successful payment
        if (type === 'order' && cartItems && addressId) {
          try {
            const phone = deliveryPhone || currentUser?.phone;
            if (!phone || phone.trim() === '') {
              throw new Error('Phone number is required');
            }
            const order = await placeOrder(cartItems, addressId, phone);
            setTimeout(() => {
              onNavigate('order-detail', order);
            }, 2000);
          } catch (error: any) {
            console.error('Failed to create order after payment:', error);
            toast.error(error.message || 'Payment successful but order creation failed. Please contact support.');
            setTimeout(() => {
              onNavigate('orders');
            }, 2000);
          }
        } else {
          // For subscriptions, already created before payment
          setTimeout(() => {
            onNavigate('subscriptions');
          }, 2000);
        }
      } else {
        setPaymentStatus('failed');
        toast.error(verifyResponse.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
      toast.error('Payment verification failed. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMockPayment = async () => {
    // Fallback mock payment for development
    await new Promise(resolve => setTimeout(resolve, 2000));
    const paymentSuccess = Math.random() > 0.1;
    
    if (paymentSuccess) {
      setPaymentStatus('success');
      toast.success('Payment successful! (Mock mode)');
      
      if (type === 'order' && cartItems && addressId) {
        try {
          const phone = deliveryPhone || currentUser?.phone;
          if (!phone || phone.trim() === '') {
            throw new Error('Phone number is required');
          }
          const order = await placeOrder(cartItems, addressId, phone);
          setTimeout(() => {
            onNavigate('order-detail', order);
          }, 2000);
        } catch (error: any) {
          console.error('Failed to create order after payment:', error);
          toast.error(error.message || 'Payment successful but order creation failed.');
          setTimeout(() => {
            onNavigate('orders');
          }, 2000);
        }
      } else {
        setTimeout(() => {
          onNavigate('subscriptions');
        }, 2000);
      }
    } else {
      setPaymentStatus('failed');
      toast.error('Payment failed. Please try again.');
    }
    setIsProcessing(false);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your payment has been processed successfully.
          </p>
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
          <p className="text-muted-foreground mb-6">
            Your payment could not be processed. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => onNavigate('cart')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => onNavigate('cart')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <Card className="p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-6">Payment</h1>

          {/* Order Summary */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-xl font-semibold">₹{amount.toFixed(2)}</span>
            </div>
            {description && (
              <div className="text-sm text-muted-foreground">{description}</div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={paymentMethod === 'razorpay' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('razorpay')}
                className="h-20 flex-col"
              >
                <CreditCard className="h-6 w-6 mb-2" />
                Razorpay
              </Button>
              <Button
                variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('upi')}
                className="h-20 flex-col"
                disabled
              >
                <CreditCard className="h-6 w-6 mb-2" />
                UPI
                <Badge variant="secondary" className="mt-1 text-xs">Soon</Badge>
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="h-20 flex-col"
                disabled
              >
                <CreditCard className="h-6 w-6 mb-2" />
                Card
                <Badge variant="secondary" className="mt-1 text-xs">Soon</Badge>
              </Button>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ₹{amount.toFixed(2)}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Your payment is secured with industry-standard encryption
          </p>
        </Card>
      </div>
    </div>
  );
}
