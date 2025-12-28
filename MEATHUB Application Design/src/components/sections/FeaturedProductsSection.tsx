import React from 'react';
import { CompactProductCard } from '../premium/CompactProductCard';
import { MeatProduct } from '../../types';
import { toast } from 'sonner';

interface FeaturedProductsSectionProps {
    products: MeatProduct[];
    onProductClick?: (product: MeatProduct) => void;
    onAddToCart?: (productId: number | string) => void;
}

export function FeaturedProductsSection({
    products,
    onProductClick,
    onAddToCart,
}: FeaturedProductsSectionProps) {
    const handleAddToCart = async (id: number | string) => {
        await onAddToCart?.(id);
        toast.success('Added to cart!', {
            description: 'Product added successfully',
            duration: 2000,
        });
    };

    // Show first 8-12 products in compact grid
    const displayProducts = products.slice(0, 12);

    if (displayProducts.length === 0) {
        return null;
    }

    return (
        <>
            {/* Compact Product Grid - TenderCuts Style with Realistic Bag Handles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-8">
                {displayProducts.map((product, index) => {
                    // Add demo properties for premium display
                    const isFresh = index % 3 === 0;
                    const isBestseller = index % 4 === 0;
                    const isPremium = index % 5 === 0;
                    const rating = 4.5 + (Math.random() * 0.5);

                    return (
                        <CompactProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            image={product.imageUrl}
                            rating={rating}
                            isFresh={isFresh}
                            isBestseller={isBestseller}
                            isPremium={isPremium}
                            weight={`500${product.unit}`}
                            onAddToCart={handleAddToCart}
                            onClick={() => onProductClick?.(product)}
                        />
                    );
                })}
            </div>
        </>
    );
}
