// MEATHUB - Butcher Items Page (Shows products from selected butcher)

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MeatProduct } from '../../types';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { ArrowLeft, MapPin, Phone, Star, Loader2, ShoppingCart } from 'lucide-react';
import { butcherApi, NearbyButcher } from '../../api/butcherApi';
import { productApi } from '../../api/productApi';
import { mapMeatItemToProduct } from '../../api/mappers';
import { toast } from 'sonner';

interface ButcherItemsPageProps {
  butcherId: number;
  onNavigate: (page: string, data?: any) => void;
}

export function ButcherItemsPage({ butcherId, onNavigate }: ButcherItemsPageProps) {
  const { addToCart, selectedButcherId, setSelectedButcherId, cart } = useApp();
  const [butcher, setButcher] = useState<NearbyButcher | null>(null);
  const [products, setProducts] = useState<MeatProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingButcher, setLoadingButcher] = useState(true);

  useEffect(() => {
    loadButcherDetails();
    loadButcherItems();
  }, [butcherId]);

  const loadButcherDetails = async () => {
    try {
      setLoadingButcher(true);
      const butcherData = await butcherApi.getButcherById(butcherId);
      // Convert to NearbyButcher format
      const nearbyButcher: NearbyButcher = {
        id: butcherData.id,
        shopName: butcherData.shopName,
        address: butcherData.address,
        phoneNumber: butcherData.phoneNumber,
        description: butcherData.description || '',
        distanceKm: 0,
        latitude: 0,
        longitude: 0,
        serviceRadiusKm: 0,
        isAvailable: butcherData.status === 'APPROVED',
        status: butcherData.status,
      };
      setButcher(nearbyButcher);
    } catch (error) {
      console.error('Failed to load butcher details:', error);
      toast.error('Failed to load butcher details');
    } finally {
      setLoadingButcher(false);
    }
  };

  const loadButcherItems = async () => {
    try {
      setLoading(true);
      const items = await butcherApi.getButcherItems(butcherId);
      // Map products and ensure butcherId is set
      const mappedProducts = items.map(item => {
        const product = mapMeatItemToProduct(item);
        // Ensure butcherId is set even if backend doesn't return it
        if (!product.butcherId) {
          product.butcherId = butcherId;
        }
        return product;
      });
      setProducts(mappedProducts);
      
      // Set selected butcher in context if not already set
      if (selectedButcherId !== butcherId) {
        setSelectedButcherId(butcherId);
      }
    } catch (error) {
      console.error('Failed to load butcher items:', error);
      toast.error('Failed to load items');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: MeatProduct) => {
    onNavigate('product-detail', product);
  };

  const handleSubscribe = (product: MeatProduct) => {
    onNavigate('subscriptions', product);
  };

  const handleAddToCart = (product: MeatProduct) => {
    // Check if cart has items from different butcher
    if (cart.length > 0) {
      const cartButcherId = cart[0].butcherId;
      if (cartButcherId && cartButcherId !== butcherId) {
        toast.error(
          'Your cart contains items from another butcher. Please clear your cart or complete that order first.',
          { duration: 5000 }
        );
        return;
      }
    }

    // Set selected butcher if not already set
    if (selectedButcherId !== butcherId) {
      setSelectedButcherId(butcherId);
    }

    addToCart({
      product,
      quantity: 0.5,
      butcherId: butcherId,
    });

    toast.success(`Added ${product.name} to cart`);
  };

  if (loadingButcher) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading butcher details...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('butcher-selection')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Butchers
          </Button>

          {/* Butcher Info Card */}
          {butcher && (
            <Card className="p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl font-semibold">{butcher.shopName}</h1>
                    {butcher.isAvailable ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Unavailable
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{butcher.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{butcher.phoneNumber}</span>
                    </div>
                    {butcher.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {butcher.rating.toFixed(1)} 
                          {butcher.totalRatings && ` (${butcher.totalRatings} reviews)`}
                        </span>
                      </div>
                    )}
                  </div>

                  {butcher.description && (
                    <p className="mt-3 text-sm text-muted-foreground">{butcher.description}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="lg"
                    onClick={() => onNavigate('butcher-selection')}
                    variant="outline"
                  >
                    Change Butcher
                  </Button>
                  {cart.length > 0 && (
                    <Button
                      size="lg"
                      onClick={() => onNavigate('cart')}
                      className="bg-primary"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Cart ({cart.length})
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Products Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Available Items</h2>
              <Badge variant="outline">{products.length} items</Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading items...</span>
              </div>
            ) : products.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-2">No items available from this butcher</p>
                <p className="text-sm text-muted-foreground">
                  Check back later or try another butcher
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleProductClick}
                    onSubscribe={handleSubscribe}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

