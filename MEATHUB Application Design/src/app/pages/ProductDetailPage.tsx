// MEATHUB - Product Detail Page (Enhanced with Butcher Selection)

import React, { useState, useEffect } from 'react';
import { MeatProduct } from '../../types';
import { useApp } from '../../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Heart,
  Star,
  Leaf,
  Award,
  Clock,
  Store,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { ReviewSection } from '../components/review/ReviewSection';
import { ButcherRecommendation } from '../components/butcher/ButcherRecommendation';
import { butcherApi, NearbyButcher } from '../../api/butcherApi';

interface ProductDetailPageProps {
  product: MeatProduct;
  onNavigate: (page: string, data?: any) => void;
}

export function ProductDetailPage({ product, onNavigate }: ProductDetailPageProps) {
  const { addToCart, orderHistory, selectedButcherId, setSelectedButcherId, currentUser } = useApp();
  const [quantity, setQuantity] = useState(0.5);
  const [nearbyButchers, setNearbyButchers] = useState<NearbyButcher[]>([]);
  const [loadingButchers, setLoadingButchers] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [selectedButcher, setSelectedButcher] = useState<number | undefined>(selectedButcherId);
  const [showButcherSelection, setShowButcherSelection] = useState(false);
  
  // Find a delivered order for this product to enable reviews
  const deliveredOrder = orderHistory.find(order => 
    order.status === 'DELIVERED' && 
    order.items.some(item => item.productId === product.id)
  );

  // Get user location and load nearby butchers
  useEffect(() => {
    const loadButchers = async () => {
      // Try to get location from user's default address or geolocation
      if (currentUser?.addresses && currentUser.addresses.length > 0) {
        const defaultAddress = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0];
        // For now, use mock coordinates (in production, geocode the address)
        const mockLocation = { lat: 12.9716, lng: 77.5946 }; // Bangalore default
        setUserLocation(mockLocation);
        await fetchNearbyButchers(mockLocation.lat, mockLocation.lng);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
            await fetchNearbyButchers(location.lat, location.lng);
          },
          (error) => {
            // Silently handle geolocation errors
            const mockLocation = { lat: 12.9716, lng: 77.5946 };
            setUserLocation(mockLocation);
            fetchNearbyButchers(mockLocation.lat, mockLocation.lng);
          },
          {
            timeout: 5000,
            enableHighAccuracy: false
          }
        );
      } else {
        // Fallback to mock location
        const mockLocation = { lat: 12.9716, lng: 77.5946 };
        setUserLocation(mockLocation);
        fetchNearbyButchers(mockLocation.lat, mockLocation.lng);
      }
    };

    loadButchers();
  }, [currentUser]);

  const fetchNearbyButchers = async (lat: number, lng: number) => {
    try {
      setLoadingButchers(true);
      const butchers = await butcherApi.getNearbyButchers(lat, lng, 10); // 10km radius
      setNearbyButchers(butchers);
      
      // If no butcher selected, show selection
      if (!selectedButcher && butchers.length > 0) {
        setShowButcherSelection(true);
      }
    } catch (error) {
      console.error('Failed to load butchers:', error);
      toast.error('Failed to load nearby butchers');
    } finally {
      setLoadingButchers(false);
    }
  };

  const handleButcherSelect = (butcherId: number) => {
    setSelectedButcher(butcherId);
    setSelectedButcherId(butcherId);
    setShowButcherSelection(false);
    toast.success('Butcher selected!');
  };

  const handleAddToCart = () => {
    const butcherId = selectedButcher || product.butcherId || selectedButcherId;
    if (!butcherId) {
      toast.error('Please select a butcher first to add items to cart');
      setShowButcherSelection(true);
      return;
    }
    
    addToCart({ 
      product: {
        ...product,
        butcherId: butcherId,
      },
      quantity,
      butcherId: butcherId,
    });
    toast.success(`Added ${quantity}${product.unit} of ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>

          {/* Product Detail */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Image */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Leaf, label: 'Fresh Daily' },
                  { icon: Award, label: 'Quality Tested' },
                  { icon: Clock, label: '2Hr Delivery' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
                    <p className="text-muted-foreground">{product.cutType} • {product.category}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(4.8 • 234 reviews)</span>
                </div>
              </div>

              <Separator />

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-semibold text-primary">₹{product.price}</span>
                  <span className="text-muted-foreground">/ {product.unit}</span>
                </div>
                <p className="text-sm text-green-600">In Stock - Fresh Delivery</p>
              </div>

              {/* Quantity Selector */}
              <div>
                <p className="text-sm font-medium mb-2">Select Quantity</p>
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-semibold">{quantity}</p>
                    <p className="text-xs text-muted-foreground">{product.unit}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.min(10, quantity + 0.5))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Butcher Selection */}
              {showButcherSelection && nearbyButchers.length > 0 && (
                <Card className="p-4 bg-muted/50 border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Select Your Butcher</h3>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowButcherSelection(false)}
                    >
                      Hide
                    </Button>
                  </div>
                  <ButcherRecommendation
                    butchers={nearbyButchers}
                    userLocation={userLocation}
                    onSelectButcher={handleButcherSelect}
                    selectedButcherId={selectedButcher}
                  />
                </Card>
              )}

              {/* Selected Butcher Info */}
              {selectedButcher && !showButcherSelection && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Ordering from</p>
                        <p className="text-xs text-muted-foreground">
                          {nearbyButchers.find(b => b.id === selectedButcher)?.shopName || 'Selected Butcher'}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowButcherSelection(true)}
                    >
                      Change
                    </Button>
                  </div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary-dark"
                  onClick={handleAddToCart}
                  disabled={!selectedButcher && !product.butcherId && !selectedButcherId}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart - ₹{(product.price * quantity).toFixed(2)}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('subscriptions', product)}
                >
                  Subscribe
                </Button>
              </div>

              {/* Butcher Selection Prompt */}
              {!selectedButcher && !product.butcherId && !selectedButcherId && nearbyButchers.length > 0 && !showButcherSelection && (
                <Card className="p-4 bg-muted/50">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Select a Butcher</p>
                      <p className="text-xs text-muted-foreground">
                        Choose a nearby butcher to add this item to cart
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowButcherSelection(true)}
                    >
                      Select
                    </Button>
                  </div>
                </Card>
              )}

              {/* Description */}
              <Card className="p-4 bg-accent">
                <p className="text-sm">{product.description}</p>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="nutrition" className="space-y-6">
            <TabsList>
              <TabsTrigger value="nutrition">Nutrition Info</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="cooking">Cooking Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="nutrition">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Nutritional Information (per 100g)</h3>
                {product.nutritionInfo && (
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-semibold text-primary">{product.nutritionInfo.protein}g</p>
                      <p className="text-sm text-muted-foreground">Protein</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-semibold text-primary">{product.nutritionInfo.fat}g</p>
                      <p className="text-sm text-muted-foreground">Fat</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-semibold text-primary">{product.nutritionInfo.calories}</p>
                      <p className="text-sm text-muted-foreground">Calories</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-semibold text-primary">{product.nutritionInfo.carbs}g</p>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="benefits">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Health Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>High-quality protein for muscle building and repair</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Rich in essential vitamins and minerals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Supports overall health and wellness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Perfect for a balanced diet</span>
                  </li>
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="cooking">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Cooking Suggestions</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-1">Recommended Cooking Methods:</p>
                    <p className="text-sm text-muted-foreground">
                      Grilling, Pan-frying, Baking, or Slow-cooking for best results
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Storage:</p>
                    <p className="text-sm text-muted-foreground">
                      Store in refrigerator at 0-4°C. Best consumed within 2 days of delivery.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Chef's Tip:</p>
                    <p className="text-sm text-muted-foreground">
                      Marinate for 30 minutes before cooking for enhanced flavor and tenderness.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Reviews Section */}
          <div className="mt-8">
            <ReviewSection 
              meatItemId={product.id} 
              orderId={deliveredOrder?.id}
              onReviewSubmitted={() => {
                // Refresh reviews after submission
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
