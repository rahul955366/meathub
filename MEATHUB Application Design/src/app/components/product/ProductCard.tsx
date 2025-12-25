// MEATHUB - Product Card Component

import React, { useState } from 'react';
import { MeatProduct } from '../../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Minus, ShoppingCart, Heart, Info } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: MeatProduct;
  onViewDetails: (product: MeatProduct) => void;
  onSubscribe?: (product: MeatProduct) => void;
}

export function ProductCard({ product, onViewDetails, onSubscribe }: ProductCardProps) {
  const { addToCart, cart, selectedButcherId } = useApp();
  const [quantity, setQuantity] = useState(0.5);
  const [showQuantity, setShowQuantity] = useState(false);

  const cartItem = cart.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!showQuantity) {
      setShowQuantity(true);
      return;
    }

    // Get butcherId from product or from context (selectedButcherId)
    const butcherId = product.butcherId || selectedButcherId;

    if (!butcherId) {
      toast.error('Please select a butcher first to add items to cart', {
        duration: 5000,
        action: {
          label: 'Select Butcher',
          onClick: () => {
            // Navigate to butcher selection - we'll need to pass onNavigate prop
            window.location.href = '/butcher-selection';
          }
        }
      });
      return;
    }

    // Ensure product has butcherId set
    const productWithButcher = {
      ...product,
      butcherId: butcherId,
    };

    addToCart({
      product: productWithButcher,
      quantity,
      butcherId: butcherId,
    });

    toast.success(`Added ${quantity}${product.unit} of ${product.name} to cart`);
    setShowQuantity(false);
    setQuantity(0.5);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.min(prev + 0.5, 10));
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(prev - 0.5, 0.5));
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover-scale animate-fade-in border-none shadow-sm"
      onClick={() => onViewDetails(product)}
    >
      {/* Image - Classic Clean */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
        />

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}

        {/* Wishlist Button - Classic Design */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.info('Wishlist feature coming soon!');
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm z-20"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Tags - Classic Badges */}
        {product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
            {product.tags.slice(0, 2).map(tag => (
              <Badge
                key={tag}
                className="text-xs bg-primary text-primary-foreground font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-base line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {product.cutType} • {product.category}
          </p>
        </div>

        {/* Nutrition Info (if available) */}
        {product.nutritionInfo && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Protein:</span>
              <span className="font-medium">{product.nutritionInfo.protein}g</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Cal:</span>
              <span className="font-medium">{product.nutritionInfo.calories}</span>
            </div>
          </div>
        )}

        {/* Price - Classic Clean */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-primary">
            ₹{product.price}
          </span>
          <span className="text-sm text-muted-foreground">
            / {product.unit}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {showQuantity && product.inStock ? (
            <div className="flex items-center gap-2 flex-1">
              <Button
                size="sm"
                variant="outline"
                onClick={decrementQuantity}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="font-semibold">{quantity}</span>
                <span className="text-xs text-muted-foreground ml-1">{product.unit}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={incrementQuantity}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : null}

          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            variant="default"
            className={`${showQuantity ? '' : 'flex-1'}`}
            size="sm"
          >
            {isInCart ? (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add More
              </>
            ) : showQuantity ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>

          {!showQuantity && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="px-3"
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Subscribe Option */}
        {product.inStock && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              if (onSubscribe) {
                onSubscribe(product);
              } else {
                toast.info('Subscription feature - redirects to subscription page');
              }
            }}
          >
            Subscribe & Save 10%
          </Button>
        )}
      </div>
    </Card>
  );
}
