// MEATHUB - Subscription Page
// Country Delight-style subscription management

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { subscriptionApi, SubscriptionResponse } from '../../api/subscriptionApi';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Plus, 
  Pause, 
  Play, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { MeatProduct } from '../../types';

interface SubscriptionPageProps {
  onNavigate: (page: string, data?: any) => void;
  product?: MeatProduct; // Optional: Product to subscribe to
  period?: 'WEEKLY' | 'MONTHLY' | 'YEARLY'; // Pre-selected period from homepage
}

export function SubscriptionPage({ onNavigate, product, period: preSelectedPeriod }: SubscriptionPageProps) {
  const { currentUser, isAuthenticated, setShowAuthModal } = useApp();
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(!!preSelectedPeriod || !!product);
  const [selectedProduct, setSelectedProduct] = useState<MeatProduct | null>(product || null);

  // Form state
  const [formData, setFormData] = useState({
    quantityKg: 1,
    period: (preSelectedPeriod || 'WEEKLY') as 'WEEKLY' | 'MONTHLY' | 'YEARLY',
    deliveryOption: 'SUNDAY_ONLY' as 'WEDNESDAY_SUNDAY' | 'SUNDAY_ONLY',
    deliveryTime: '09:00',
    isSundaySpecial: false,
    deliveryAddress: '',
    deliveryPhone: currentUser?.phone || '',
    notifyIfNotHome: false,
    notes: '',
  });

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadSubscriptions();
      // Pre-fill address if user has addresses
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const defaultAddress = currentUser.addresses[0];
        setFormData(prev => ({
          ...prev,
          deliveryAddress: `${defaultAddress.line1}${defaultAddress.line2 ? ', ' + defaultAddress.line2 : ''}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.pincode}`,
        }));
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
      setShowCreateForm(true);
    }
  }, [product]);

  useEffect(() => {
    if (preSelectedPeriod) {
      setFormData(prev => ({
        ...prev,
        period: preSelectedPeriod,
      }));
      setShowCreateForm(true);
    }
  }, [preSelectedPeriod]);

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionApi.getMySubscriptions();
      setSubscriptions(data);
    } catch (error: any) {
      console.error('Failed to load subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedProduct) {
      toast.error('Please select a product first');
      return;
    }

    if (!formData.deliveryAddress || !formData.deliveryPhone) {
      toast.error('Please fill in delivery address and phone');
      return;
    }

    try {
      // Calculate subscription price based on period and delivery option
      const basePrice = selectedProduct.price * formData.quantityKg;
      let multiplier = 1;
      
      if (formData.period === 'MONTHLY') {
        multiplier = 4; // 4 weeks
      } else if (formData.period === 'YEARLY') {
        multiplier = 52; // 52 weeks
      }
      
      // Delivery option pricing
      if (formData.deliveryOption === 'WEDNESDAY_SUNDAY') {
        multiplier *= 1.2; // 20% more for twice weekly
      }
      
      // Sunday Special discount (10% off)
      if (formData.isSundaySpecial) {
        multiplier *= 0.9;
      }
      
      const subscriptionPrice = basePrice * multiplier;

      // Prepare request payload
      const requestPayload: any = {
        butcherId: (selectedProduct as any).butcherId || 1,
        meatItemId: parseInt(selectedProduct.id),
        meatItemName: selectedProduct.name,
        quantityKg: formData.quantityKg,
        period: formData.period,
        deliveryOption: formData.deliveryOption,
        isSundaySpecial: formData.isSundaySpecial,
        deliveryAddress: formData.deliveryAddress,
        deliveryPhone: formData.deliveryPhone,
        subscriptionPrice: subscriptionPrice,
        notifyIfNotHome: formData.notifyIfNotHome,
      };

      // Only include deliveryTime if not Sunday Special
      if (!formData.isSundaySpecial && formData.deliveryTime) {
        requestPayload.deliveryTime = formData.deliveryTime + ':00';
      }

      // Include notes if provided
      if (formData.notes) {
        requestPayload.notes = formData.notes;
      }

      console.log('Creating subscription with payload:', requestPayload);

      const subscription = await subscriptionApi.createSubscription(requestPayload);

      toast.success('Subscription created successfully!');
      setShowCreateForm(false);
      
      // Navigate to payment page
      onNavigate('payment', {
        subscriptionId: subscription.id,
        amount: subscriptionPrice,
        type: 'subscription',
        description: `${selectedProduct.name} - ${formatPeriod(formData.period)} Subscription`,
      });
      setFormData({
        quantityKg: 1,
        period: 'WEEKLY',
        deliveryOption: 'SUNDAY_ONLY',
        deliveryTime: '09:00',
        isSundaySpecial: false,
        deliveryAddress: formData.deliveryAddress, // Keep address
        deliveryPhone: formData.deliveryPhone, // Keep phone
        notifyIfNotHome: false,
        notes: '',
      });
      loadSubscriptions();
    } catch (error: any) {
      console.error('Failed to create subscription:', error);
      toast.error(error.message || 'Failed to create subscription');
    }
  };

  const handlePause = async (id: number) => {
    try {
      await subscriptionApi.pauseSubscription(id);
      toast.success('Subscription paused');
      loadSubscriptions();
    } catch (error: any) {
      console.error('Failed to pause subscription:', error);
      toast.error('Failed to pause subscription');
    }
  };

  const handleResume = async (id: number) => {
    try {
      await subscriptionApi.resumeSubscription(id);
      toast.success('Subscription resumed');
      loadSubscriptions();
    } catch (error: any) {
      console.error('Failed to resume subscription:', error);
      toast.error('Failed to resume subscription');
    }
  };

  const formatPeriod = (period: string) => {
    switch (period) {
      case 'WEEKLY': return 'Weekly';
      case 'MONTHLY': return 'Monthly';
      case 'YEARLY': return 'Yearly';
      default: return period;
    }
  };

  const formatDeliveryOption = (option: string) => {
    switch (option) {
      case 'WEDNESDAY_SUNDAY': return 'Wednesday & Sunday';
      case 'SUNDAY_ONLY': return 'Sunday Only';
      default: return option;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <Card className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login to manage your subscriptions
            </p>
            <Button onClick={() => setShowAuthModal(true)}>
              Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading subscriptions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold mb-2">My Subscriptions</h1>
              <p className="text-muted-foreground">
                Manage your meat subscriptions - Get fresh meat delivered regularly
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Subscription
            </Button>
          </div>

          {showCreateForm && (
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Create Subscription</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Product Selection */}
                {!selectedProduct && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Product
                    </label>
                    <Button variant="outline" onClick={() => onNavigate('home')}>
                      Browse Products
                    </Button>
                  </div>
                )}

                {selectedProduct && (
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <img
                      src={selectedProduct.imageUrl || '/placeholder-meat.jpg'}
                      alt={selectedProduct.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedProduct.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ₹{selectedProduct.price} / {selectedProduct.unit}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedProduct(null)}>
                      Change
                    </Button>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity ({selectedProduct?.unit || 'KG'})
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.quantityKg}
                    onChange={(e) => setFormData({ ...formData, quantityKg: parseFloat(e.target.value) || 0.5 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                {/* Subscription Period */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subscription Period
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((period) => (
                      <Button
                        key={period}
                        variant={formData.period === period ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, period })}
                      >
                        {formatPeriod(period)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Delivery Option */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Schedule
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={formData.deliveryOption === 'SUNDAY_ONLY' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, deliveryOption: 'SUNDAY_ONLY' })}
                    >
                      Sunday Only
                    </Button>
                    <Button
                      variant={formData.deliveryOption === 'WEDNESDAY_SUNDAY' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, deliveryOption: 'WEDNESDAY_SUNDAY' })}
                    >
                      Wednesday & Sunday
                    </Button>
                  </div>
                </div>

                {/* Sunday Special */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sundaySpecial"
                    checked={formData.isSundaySpecial}
                    onChange={(e) => setFormData({ ...formData, isSundaySpecial: e.target.checked, deliveryTime: e.target.checked ? '' : formData.deliveryTime })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="sundaySpecial" className="text-sm">
                    <strong>Sunday Special</strong> - Delivery between 7-9 AM only (10% discount)
                  </label>
                </div>

                {/* Preferred Delivery Time (not for Sunday Special) */}
                {!formData.isSundaySpecial && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preferred Delivery Time
                    </label>
                    <input
                      type="time"
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                )}

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Enter your delivery address"
                  />
                </div>

                {/* Delivery Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.deliveryPhone}
                    onChange={(e) => setFormData({ ...formData, deliveryPhone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Notify if not home */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="notifyIfNotHome"
                    checked={formData.notifyIfNotHome}
                    onChange={(e) => setFormData({ ...formData, notifyIfNotHome: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="notifyIfNotHome" className="text-sm">
                    Notify me if I'm not at home
                  </label>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    placeholder="Any special instructions..."
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <Button onClick={handleCreateSubscription} className="flex-1">
                    Create Subscription
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Active Subscriptions */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {subscriptions.filter(s => s.active).length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.filter(s => s.active).map((sub) => (
                    <SubscriptionCard
                      key={sub.id}
                      subscription={sub}
                      onPause={handlePause}
                      onResume={handleResume}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No active subscriptions</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create Subscription
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="paused">
              {subscriptions.filter(s => !s.active).length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.filter(s => !s.active).map((sub) => (
                    <SubscriptionCard
                      key={sub.id}
                      subscription={sub}
                      onPause={handlePause}
                      onResume={handleResume}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No paused subscriptions</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all">
              {subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <SubscriptionCard
                      key={sub.id}
                      subscription={sub}
                      onPause={handlePause}
                      onResume={handleResume}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No subscriptions yet</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create Subscription
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface SubscriptionCardProps {
  subscription: SubscriptionResponse;
  onPause: (id: number) => void;
  onResume: (id: number) => void;
}

function SubscriptionCard({ subscription, onPause, onResume }: SubscriptionCardProps) {
  const formatPeriod = (period: string) => {
    switch (period) {
      case 'WEEKLY': return 'Weekly';
      case 'MONTHLY': return 'Monthly';
      case 'YEARLY': return 'Yearly';
      default: return period;
    }
  };

  const formatDeliveryOption = (option: string) => {
    switch (option) {
      case 'WEDNESDAY_SUNDAY': return 'Wednesday & Sunday';
      case 'SUNDAY_ONLY': return 'Sunday Only';
      default: return option;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold">{subscription.meatItemName}</h3>
            {subscription.active ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatPeriod(subscription.period)} • {formatDeliveryOption(subscription.deliveryOption)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Quantity: {subscription.quantityKg} KG</span>
            </div>
            {subscription.isSundaySpecial ? (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="h-4 w-4" />
                <span>Sunday Special: 7-9 AM</span>
              </div>
            ) : subscription.deliveryTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Preferred Time: {subscription.deliveryTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{subscription.deliveryAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{subscription.deliveryPhone}</span>
            </div>
            {subscription.notifyIfNotHome && (
              <div className="flex items-center gap-2 text-blue-600">
                <AlertCircle className="h-4 w-4" />
                <span>Will notify if not at home</span>
              </div>
            )}
            <div className="mt-2 pt-2 border-t">
              <span className="font-semibold text-foreground">
                Next Delivery: {new Date(subscription.nextRunDate).toLocaleDateString()}
              </span>
            </div>
            <div className="text-lg font-semibold text-primary">
              ₹{subscription.subscriptionPrice?.toFixed(2)} / {formatPeriod(subscription.period)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {subscription.active ? (
            <Button variant="outline" size="sm" onClick={() => onPause(subscription.id)}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => onResume(subscription.id)}>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

