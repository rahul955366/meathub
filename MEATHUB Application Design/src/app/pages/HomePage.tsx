// MEATHUB - Home Page (Split Layout: Left = Categories, Right = GenAI + Butcher Search)

import React from 'react';
import { useApp } from '../../context/AppContext';
import { MeatProduct } from '../../types';
import { FloatingOrderTracker } from '../components/order/FloatingOrderTracker';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { productApi } from '../../api/productApi';
import { mapMeatItemToProduct } from '../../api/mappers';
import { butcherApi } from '../../api/butcherApi';
import { NearbyButcher } from '../../api/butcherApi';
import {
  ArrowRight,
  Sparkles,
  Info,
  Award,
  Shield,
  Clock,
  X,
  Store
} from 'lucide-react';
import { AIHero } from '../components/ai/AIHero';
import { ButcherSearchBox } from '../components/butcher/ButcherSearchBox';
import { toast } from 'sonner';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

const meatCategories = [
  {
    id: 'CHICKEN',
    name: 'Chicken',
    description: 'Fresh & Tender',
    subcategories: ['Curry Cut', 'Boneless', 'Legs', 'Wings', 'Breast']
  },
  {
    id: 'MUTTON',
    name: 'Mutton',
    description: 'Premium Quality',
    subcategories: ['Curry Cut', 'Bone-in', 'Boneless', 'Keema', 'Chops']
  },
  {
    id: 'FISH',
    name: 'Fish',
    description: 'Ocean Fresh',
    subcategories: ['Rohu', 'Pomfret', 'Seer', 'Basa', 'Tuna']
  },
  {
    id: 'PRAWNS',
    name: 'Prawns',
    description: 'Jumbo Size',
    subcategories: ['Jumbo', 'Medium', 'Small', 'Tiger Prawns']
  },
  {
    id: 'MARINATED',
    name: 'Marinated',
    description: 'Ready to Cook',
    subcategories: ['Tandoori', 'Butter Chicken', 'Kebab', 'Biryani']
  }
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { isAuthenticated, activeOrder, selectedButcherId, setSelectedButcherId } = useApp();
  const [products, setProducts] = React.useState<MeatProduct[]>([]);
  const [butcherProducts, setButcherProducts] = React.useState<MeatProduct[]>([]);
  const [selectedButcher, setSelectedButcher] = React.useState<NearbyButcher | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingButcherProducts, setLoadingButcherProducts] = React.useState(false);

  // Load all products from backend
  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const items = await productApi.getAvailableItems();
        const mappedProducts = items.map(mapMeatItemToProduct);
        setProducts(mappedProducts);
      } catch (error: any) {
        // Silently handle error - don't spam console
        console.log('Products not available yet - services may still be starting');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Load butcher's products when butcher is selected
  React.useEffect(() => {
    const loadButcherProducts = async () => {
      if (!selectedButcher) {
        setButcherProducts([]);
        return;
      }

      try {
        setLoadingButcherProducts(true);
        const items = await productApi.getItemsByButcher(selectedButcher.id);
        const mappedProducts = items.map(mapMeatItemToProduct);
        setButcherProducts(mappedProducts);
      } catch (error: any) {
        // Silently handle error - don't spam console
        console.log('Butcher products not available yet');
        setButcherProducts([]);
        // Only show toast if it's not a network error
        if (error?.status !== 0) {
          toast.error('Failed to load butcher products');
        }
      } finally {
        setLoadingButcherProducts(false);
      }
    };

    loadButcherProducts();
  }, [selectedButcher]);

  const handleProductClick = (product: MeatProduct) => {
    onNavigate('product-detail', product);
  };

  const handleCategoryClick = (categoryId: string) => {
    onNavigate('category', categoryId);
  };

  const handleButcherSelect = (butcher: NearbyButcher) => {
    setSelectedButcher(butcher);
    setSelectedButcherId(butcher.id);
  };

  const handleClearButcher = () => {
    setSelectedButcher(null);
    setSelectedButcherId(null);
    setButcherProducts([]);
    toast.info('Butcher selection cleared');
  };

  const handleAIQuickAction = (action: string) => {
    switch (action) {
      case 'find-butcher':
        // Focus on butcher search
        document.getElementById('butcher-search')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'track-order':
        if (activeOrder) {
          onNavigate('order-detail', activeOrder);
        } else {
          toast.info('No active orders');
        }
        break;
      case 'cooking-help':
        // Open AI assistant for cooking help
        toast.info('Ask me: "How do I cook chicken curry?"');
        break;
    }
  };

  // Group products by category
  const productsByCategory = meatCategories.map(category => ({
    ...category,
    items: products.filter(p => p.category === category.id)
  }));

  // Group butcher products by category
  const butcherProductsByCategory = selectedButcher
    ? meatCategories.map(category => ({
      ...category,
      items: butcherProducts.filter(p => p.category === category.id)
    }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-primary via-primary-light to-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              🎉 Special Offer: 50% Off on First Delivery! 🎉
            </h2>
            <p className="text-sm md:text-base opacity-90">
              Use code FIRST50 at checkout • Valid for new customers only
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Split Layout */}
      <section className="py-8 md:py-12 bg-background animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - Meat Items by Category */}
            <div className="space-y-8">
              {productsByCategory.map((category) => (
                <div key={category.id}>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Subcategories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.subcategories.map((subcat) => (
                      <Badge
                        key={subcat}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {subcat}
                      </Badge>
                    ))}
                  </div>

                  {/* Category Items - Round Images */}
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                  ) : category.items.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 md:gap-4">
                      {category.items.slice(0, 12).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="cursor-pointer group"
                        >
                          <div className="relative w-full aspect-square rounded-full overflow-hidden bg-muted border-2 border-transparent group-hover:border-primary transition-all shadow-md group-hover:shadow-lg">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-2 left-0 right-0 text-center text-white">
                                <p className="text-xs font-semibold px-2 truncate">{product.name}</p>
                                <p className="text-xs">₹{product.price}/{product.unit}</p>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-center mt-2 font-medium truncate">{product.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No {category.name.toLowerCase()} items available
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT SIDE - GenAI Hero + Butcher Search / Butcher Products */}
            <div className="space-y-6">
              {!selectedButcher ? (
                // Default: GenAI Hero + Butcher Search
                <>
                  {/* GenAI Hero */}
                  <AIHero onQuickAction={handleAIQuickAction} />

                  {/* Butcher Search Box - Enhanced */}
                  <Card className="p-6 bg-gradient-to-br from-background to-muted/30 border-primary/20 shadow-lg" id="butcher-search">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                        <Store className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          Find Your Butcher
                        </h3>
                        <p className="text-xs text-muted-foreground">Search by name or distance</p>
                      </div>
                    </div>
                    <ButcherSearchBox
                      onButcherSelect={handleButcherSelect}
                      selectedButcherId={selectedButcherId || undefined}
                      onClearSelection={handleClearButcher}
                    />
                  </Card>
                </>
              ) : (
                // Selected Butcher: Show Butcher's Products
                <div className="space-y-4">
                  {/* Selected Butcher Header */}
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Store className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedButcher.shopName}</h3>
                          <p className="text-xs text-muted-foreground">{selectedButcher.address}</p>
                          {selectedButcher.distanceKm && (
                            <p className="text-xs text-muted-foreground">
                              {selectedButcher.distanceKm.toFixed(1)} km away
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleClearButcher}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </Card>

                  {/* Butcher's Products by Category */}
                  {loadingButcherProducts ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">Loading butcher's products...</p>
                    </div>
                  ) : butcherProductsByCategory.some(cat => cat.items.length > 0) ? (
                    <div className="space-y-6">
                      {butcherProductsByCategory.map((category) => {
                        if (category.items.length === 0) return null;

                        return (
                          <div key={category.id}>
                            <h4 className="font-semibold mb-3">{category.name}</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                              {category.items.map((product) => (
                                <div
                                  key={product.id}
                                  onClick={() => handleProductClick(product)}
                                  className="cursor-pointer group"
                                >
                                  <div className="relative w-full aspect-square rounded-full overflow-hidden bg-muted border-2 border-transparent group-hover:border-primary transition-all shadow-md group-hover:shadow-lg">
                                    <img
                                      src={product.imageUrl}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="absolute bottom-2 left-0 right-0 text-center text-white">
                                        <p className="text-xs font-semibold px-2 truncate">{product.name}</p>
                                        <p className="text-xs">₹{product.price}/{product.unit}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xs text-center mt-2 font-medium truncate">{product.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">
                        No products available from {selectedButcher.shopName}
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleClearButcher}
                      >
                        Select Different Butcher
                      </Button>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About MeatHub Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-foreground">
                About MEATHUB
              </h2>
              <p className="text-lg text-muted-foreground">
                Your trusted partner for premium quality meat
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">
                  We source only the finest cuts from trusted local suppliers, ensuring freshness and quality in every order.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Get your order delivered within 2 hours. We cut fresh, pack carefully, and deliver promptly to your doorstep.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Trusted by 50K+</h3>
                <p className="text-sm text-muted-foreground">
                  Join thousands of satisfied customers who trust us for their daily meat needs. Quality you can rely on.
                </p>
              </Card>
            </div>

            <Card className="p-8 bg-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Our Story</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    MEATHUB works like usual order platforms like Licious and TenderCuts, where you can browse and order meat items directly.
                    Additionally, we offer the option to order by selecting your preferred butcher.
                    We work directly with local suppliers to ensure the highest standards of freshness and quality.
                    Every cut is carefully selected, freshly prepared, and delivered with care.
                    Experience the difference that quality makes.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Floating Order Tracker */}
      {isAuthenticated && activeOrder && (
        <FloatingOrderTracker
          order={activeOrder}
          onViewDetails={() => onNavigate('order-detail', activeOrder)}
        />
      )}
    </div>
  );
}
