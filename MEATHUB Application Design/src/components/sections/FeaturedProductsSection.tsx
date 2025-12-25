import React from 'react';
import { PremiumProductCard } from '../premium/PremiumProductCard';
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
            description: 'Product has been added to your cart',
            duration: 2000,
        });
    };

    const handleQuickView = (id: number | string) => {
        const product = products.find(p => p.id === id);
        if (product && onProductClick) {
            onProductClick(product);
        }
    };

    // Show first 6 products
    const displayProducts = products.slice(0, 6);

    if (displayProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-[--foreground] mb-3">
                        Premium Selection
                    </h2>
                    <p className="text-lg text-[--muted-foreground] font-[family-name:var(--font-body)]">
                        Handpicked finest cuts, delivered fresh to your door
                    </p>
                    <div className="w-24 h-1 bg-[image:var(--gradient-gold)] mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {displayProducts.map((product, index) => {
                        // Add demo properties for premium display
                        const isFresh = index % 3 === 0; // Every 3rd product is fresh
                        const isBestseller = index % 4 === 0; // Every 4th is bestseller
                        const isPremium = index % 5 === 0; // Every 5th is premium
                        const rating = 4.5 + (Math.random() * 0.5); // Random rating 4.5-5.0
                        const reviewCount = Math.floor(50 + Math.random() * 150); // Random reviews 50-200

                        return (
                            <PremiumProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                image={product.imageUrl}
                                rating={rating}
                                reviewCount={reviewCount}
                                isFresh={isFresh}
                                isBestseller={isBestseller}
                                isPremium={isPremium}
                                weight={`500${product.unit}`}
                                onAddToCart={handleAddToCart}
                                onQuickView={handleQuickView}
                                onClick={() => onProductClick?.(product)}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
