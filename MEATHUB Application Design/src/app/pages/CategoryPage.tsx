// MEATHUB - Category Page (Shows all meat items in a category)

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MeatProduct } from '../../types';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Search, Store } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { mapMeatItemToProduct } from '../../api/mappers';
import { Input } from '../components/ui/input';

interface CategoryPageProps {
  categoryId: string;
  onNavigate: (page: string, data?: any) => void;
}

const categoryInfo: Record<string, { name: string; description: string; image: string }> = {
  CHICKEN: {
    name: 'Chicken',
    description: 'Fresh, tender, and versatile - perfect for any meal. Our chicken is sourced from trusted local farms and cut fresh daily.',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=400&fit=crop'
  },
  MUTTON: {
    name: 'Mutton',
    description: 'Premium quality mutton for special occasions. Rich in flavor and protein, perfect for traditional recipes.',
    image: 'https://images.unsplash.com/photo-1603048297172-c92544798d4e?w=800&h=400&fit=crop'
  },
  FISH: {
    name: 'Fish',
    description: 'Ocean fresh fish, rich in omega-3 and nutrients. Delivered fresh from the coast to your doorstep.',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&h=400&fit=crop'
  },
  PRAWNS: {
    name: 'Prawns',
    description: 'Jumbo size prawns, fresh and succulent. Perfect for seafood lovers and special occasions.',
    image: 'https://images.unsplash.com/photo-1615367423057-028559631ffe?w=800&h=400&fit=crop'
  },
  MARINATED: {
    name: 'Marinated & Ready to Cook',
    description: 'Pre-marinated for convenience, perfect for quick meals. Our signature marinades enhance flavor and tenderness.',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=400&fit=crop'
  }
};

export function CategoryPage({ categoryId, onNavigate }: CategoryPageProps) {
  const { addToCart, selectedButcherId } = useApp();
  const [products, setProducts] = useState<MeatProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MeatProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const category = categoryInfo[categoryId] || {
    name: categoryId,
    description: 'Premium quality meat products',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=400&fit=crop'
  };

  // Load products from backend
  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let items;
        
        // If butcher is selected, load items from that butcher only
        if (selectedButcherId) {
          const { butcherApi } = await import('../../api/butcherApi');
          items = await butcherApi.getButcherItems(selectedButcherId);
        } else {
          // Otherwise load all available items
          items = await productApi.getAvailableItems();
        }
        
        const mappedProducts = items.map(mapMeatItemToProduct);
        const categoryProducts = mappedProducts.filter(p => p.category === categoryId);
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, selectedButcherId]);

  // Filter products by search query
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.cutType.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleProductClick = (product: MeatProduct) => {
    onNavigate('product-detail', product);
  };

  const handleSubscribe = (product: MeatProduct) => {
    onNavigate('subscriptions', product);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Category Banner */}
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-semibold mb-2">{category.name}</h1>
                <p className="text-sm md:text-base opacity-90 max-w-2xl">{category.description}</p>
                {!selectedButcherId && (
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onNavigate('butcher-selection')}
                    >
                      Select Butcher to View Items
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${category.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {!selectedButcherId ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Select a Butcher First</h3>
              <p className="text-muted-foreground">
                Please select a nearby butcher to view available {category.name.toLowerCase()} items.
              </p>
              <Button 
                size="lg"
                onClick={() => onNavigate('butcher-selection')}
                className="mt-4"
              >
                Find Nearby Butchers
              </Button>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No products found matching your search.' : `No ${category.name.toLowerCase()} products available from selected butcher.`}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
            <div className="mt-4">
              <Button variant="outline" onClick={() => onNavigate('butcher-selection')}>
                Change Butcher
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleProductClick}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

