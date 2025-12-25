// MEATHUB - User Profile Page

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { profileApi } from '../../api/profileApi';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package,
  Calendar,
  Video,
  LogOut,
  Edit,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { currentUser, logout, subscriptions, orderHistory } = useApp();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [showPhoneEdit, setShowPhoneEdit] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [addresses, setAddresses] = React.useState(currentUser?.addresses || []);
  const [addressForm, setAddressForm] = useState({
    addressType: 'HOME',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    landmark: '',
    isDefault: false,
  });

  // Update addresses when currentUser changes
  React.useEffect(() => {
    if (currentUser?.addresses) {
      setAddresses(currentUser.addresses);
    }
    if (currentUser?.phone) {
      setPhoneNumber(currentUser.phone);
    }
  }, [currentUser?.addresses, currentUser?.phone]);

  const handleUpdatePhone = async () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSavingPhone(true);

    try {
      await profileApi.updateProfile({
        fullName: currentUser.name,
        email: currentUser.email,
        phone: phoneNumber.replace(/\D/g, ''), // Remove non-digits
      });

      toast.success('Phone number updated successfully');
      setShowPhoneEdit(false);
      
      // Reload user data
      window.dispatchEvent(new CustomEvent('addressUpdated'));
      
      // Reload user data from context
      window.location.reload(); // Simple reload to ensure all data is fresh
    } catch (error: any) {
      console.error('Failed to update phone:', error);
      const errorMessage = error?.message || error?.error || 'Failed to update phone number';
      toast.error(errorMessage);
    } finally {
      setIsSavingPhone(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Please login to view profile</p>
          <Button onClick={() => onNavigate('home')}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    onNavigate('home');
  };

  const handleAddAddress = async () => {
    if (!addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSavingAddress(true);

    try {
      console.log('Creating address with data:', addressForm);
      
      const newAddress = await profileApi.createAddress({
        addressType: addressForm.addressType,
        addressLine1: addressForm.addressLine1,
        addressLine2: addressForm.addressLine2 || undefined,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        country: addressForm.country || 'India',
        landmark: addressForm.landmark || undefined,
        isDefault: addressForm.isDefault,
      });

      console.log('Address created successfully:', newAddress);

      // Reload addresses from backend
      const updatedAddresses = await profileApi.getAddresses();
      console.log('Reloaded addresses:', updatedAddresses);
      const mappedAddresses = updatedAddresses.map(mapAddressResponse);
      setAddresses(mappedAddresses);

      // Also update currentUser addresses if available
      if (currentUser) {
        // Trigger a reload by dispatching an event that AppContext can listen to
        window.dispatchEvent(new CustomEvent('addressUpdated'));
      }

      toast.success('Address added successfully');
      setShowAddressForm(false);
      setAddressForm({
        addressType: 'HOME',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        landmark: '',
        isDefault: false,
      });
    } catch (error: any) {
      console.error('Failed to add address:', error);
      const errorMessage = error?.message || error?.error || (error?.errors ? JSON.stringify(error.errors) : null) || 'Failed to add address';
      toast.error(errorMessage);
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold mb-1">{currentUser.name}</h1>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {currentUser.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {showPhoneEdit ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="px-2 py-1 border rounded text-sm w-32"
                            placeholder="10-digit phone"
                            maxLength={10}
                          />
                          <Button size="sm" onClick={handleUpdatePhone} disabled={isSavingPhone}>
                            {isSavingPhone ? 'Saving...' : 'Save'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => {
                            setShowPhoneEdit(false);
                            setPhoneNumber(currentUser.phone || '');
                          }}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          {currentUser.phone || 'Not set'}
                          <Button variant="link" size="sm" className="h-auto p-0 ml-2" onClick={() => {
                            setShowPhoneEdit(true);
                            setPhoneNumber(currentUser.phone || '');
                          }}>
                            <Edit className="h-3 w-3 mr-1" />
                            {currentUser.phone ? 'Edit' : 'Add'}
                          </Button>
                        </>
                      )}
                    </span>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Stats Card */}
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-semibold">{orderHistory?.length || currentUser.totalOrders || 0}</p>
                    </div>
                  </div>
                </Card>

                {/* Member Since */}
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <Calendar className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="text-2xl font-semibold">
                        {new Date(currentUser.createdAt).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Orders</h3>
                {orderHistory && orderHistory.length > 0 ? (
                  <div className="space-y-3">
                    {orderHistory.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">Order #{order.id}</p>
                            <Badge variant={
                              order.status === 'DELIVERED' ? 'default' :
                              order.status === 'CANCELLED' ? 'destructive' :
                              'secondary'
                            } className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • ₹{order.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigate('order-detail', order)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                    {orderHistory.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => {
                          // Switch to orders tab
                          const ordersTab = document.querySelector('[value="orders"]') as HTMLElement;
                          if (ordersTab) ordersTab.click();
                        }}
                      >
                        View All Orders ({orderHistory.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button onClick={() => onNavigate('home')}>
                      Start Shopping
                    </Button>
                  </div>
                )}
              </Card>

              {/* Active Subscriptions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Active Subscriptions</h3>
                {subscriptions.filter(s => s.status === 'ACTIVE').length > 0 ? (
                  <div className="space-y-3">
                    {subscriptions.filter(s => s.status === 'ACTIVE').map(sub => (
                      <div key={sub.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={sub.product.imageUrl || '/placeholder-meat.jpg'}
                            alt={sub.product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-muted"
                          />
                          <div>
                            <p className="font-medium">{sub.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {sub.quantity} {sub.product.unit} • {sub.type}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Next delivery: {new Date(sub.nextDelivery).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigate('subscriptions')}
                        >
                          Manage
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No active subscriptions</p>
                    <Button onClick={() => onNavigate('subscriptions')}>
                      Browse Subscriptions
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Order History</h3>
                {orderHistory && orderHistory.length > 0 ? (
                  <div className="space-y-4">
                    {orderHistory.map(order => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold">Order #{order.id}</p>
                              <Badge variant={
                                order.status === 'DELIVERED' ? 'default' :
                                order.status === 'CANCELLED' ? 'destructive' :
                                'secondary'
                              }>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • ₹{order.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {order.deliveryAddress && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {typeof order.deliveryAddress === 'object' 
                                  ? `${order.deliveryAddress.line1}, ${order.deliveryAddress.city}`
                                  : order.deliveryAddress}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate('order-detail', order)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No orders yet
                    </p>
                    <Button onClick={() => onNavigate('home')}>
                      Start Shopping
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-4">
              {addresses && addresses.length > 0 ? (
                <>
                  {addresses.map(address => (
                    <Card key={address.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="p-2 bg-muted rounded-lg h-fit">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            {address.isDefault && (
                              <Badge variant="default" className="mb-2">Default</Badge>
                            )}
                            <p className="font-medium mb-1">
                              {address.line1}
                            </p>
                            {address.line2 && (
                              <p className="text-sm text-muted-foreground">{address.line2}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            {address.landmark && (
                              <p className="text-sm text-muted-foreground">
                                Near: {address.landmark}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Address
                  </Button>
                </>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No addresses added yet</p>
                  <Button onClick={() => setShowAddressForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Address
                  </Button>
                </Card>
              )}

              {/* Address Form Modal */}
              {showAddressForm && (
                <Card className="p-6 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Add New Address</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAddressForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Address Type</label>
                      <select
                        value={addressForm.addressType}
                        onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="HOME">Home</option>
                        <option value="WORK">Work</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                      <input
                        type="text"
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="House/Flat No., Building Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address Line 2</label>
                      <input
                        type="text"
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Street, Area, Locality"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City *</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State *</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="State"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Pincode *</label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Pincode"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Landmark</label>
                        <input
                          type="text"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Near landmark"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="isDefault" className="text-sm">
                        Set as default address
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleAddAddress} 
                        className="flex-1"
                        disabled={isSavingAddress}
                      >
                        {isSavingAddress ? 'Saving...' : 'Save Address'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddressForm(false)}
                        disabled={isSavingAddress}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Order Videos</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Watch videos of your meat being cut and packed for complete transparency
                </p>
                <div className="text-center py-8 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Videos from your orders will appear here
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
