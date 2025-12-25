import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PremiumBadge, FreshBadge, BestsellerBadge } from './PremiumBadge';
import { PremiumButton } from './PremiumButton';

export interface PremiumProductCardProps {
    id: number | string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating?: number;
    reviewCount?: number;
    isFresh?: boolean;
    isBestseller?: boolean;
    isPremium?: boolean;
    badge?: string;
    weight?: string;
    onAddToCart?: (id: number | string) => void;
    onQuickView?: (id: number | string) => void;
    onClick?: (id: number | string) => void;
    className?: string;
}

export function PremiumProductCard({
    id,
    name,
    description,
    price,
    originalPrice,
    image,
    rating,
    reviewCount,
    isFresh = false,
    isBestseller = false,
    isPremium = false,
    badge,
    weight,
    onAddToCart,
    onQuickView,
    onClick,
    className,
}: PremiumProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAdding(true);
        await onAddToCart?.(id);
        setTimeout(() => setIsAdding(false), 1000);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuickView?.(id);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onClick?.(id)}
            className={cn(
                'group relative bg-white rounded-2xl border border-[--border] overflow-hidden cursor-pointer transition-all duration-500',
                'hover:shadow-2xl hover:shadow-[--primary]/10 hover:border-[--primary]/20',
                className
            )}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {isFresh && <FreshBadge />}
                {isBestseller && <BestsellerBadge />}
                {isPremium && (
                    <PremiumBadge variant="gold" animated>
                        ✨ Premium
                    </PremiumBadge>
                )}
                {badge && (
                    <PremiumBadge variant="copper" animated>
                        {badge}
                    </PremiumBadge>
                )}
                {discount > 0 && (
                    <PremiumBadge variant="burgundy" animated>
                        {discount}% OFF
                    </PremiumBadge>
                )}
            </div>

            {/* Quick Actions */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-3 right-3 z-10 flex flex-col gap-2"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLike}
                            className={cn(
                                'p-2 rounded-full backdrop-blur-md transition-all duration-300',
                                isLiked
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                    : 'bg-white/90 text-[--primary] hover:bg-[--primary] hover:text-white'
                            )}
                        >
                            <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
                        </motion.button>

                        {onQuickView && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleQuickView}
                                className="p-2 rounded-full bg-white/90 backdrop-blur-md text-[--primary] hover:bg-[--primary] hover:text-white transition-all duration-300"
                            >
                                <Eye className="w-5 h-5" />
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-[--muted]">
                <motion.img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Gradient Overlay on Hover */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
                {/* Rating */}
                {rating && (
                    <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-[--gold] text-[--gold]" />
                        <span className="font-semibold text-[--foreground]">{rating.toFixed(1)}</span>
                        {reviewCount && (
                            <span className="text-[--muted-foreground]">({reviewCount})</span>
                        )}
                    </div>
                )}

                {/* Product Name */}
                <h3 className="font-[family-name:var(--font-accent)] font-semibold text-lg text-[--foreground] line-clamp-2 group-hover:text-[--primary] transition-colors">
                    {name}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-[--muted-foreground] line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Weight */}
                {weight && (
                    <p className="text-sm font-medium text-[--copper]">{weight}</p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-[family-name:var(--font-accent)] text-[--primary]">
                        ₹{price}
                    </span>
                    {originalPrice && originalPrice > price && (
                        <span className="text-lg text-[--muted-foreground] line-through">
                            ₹{originalPrice}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <AnimatePresence mode="wait">
                    {isHovered ? (
                        <motion.div
                            key="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <PremiumButton
                                variant={isPremium ? 'gold' : 'primary'}
                                size="md"
                                className="w-full"
                                leftIcon={<ShoppingCart className="w-5 h-5" />}
                                onClick={handleAddToCart}
                                loading={isAdding}
                            >
                                {isAdding ? 'Adding...' : 'Add to Cart'}
                            </PremiumButton>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="w-full p-3 rounded-xl bg-[--muted] text-[--primary] hover:bg-[--primary] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-[family-name:var(--font-accent)] font-semibold"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Quick Add
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Shimmer Effect on Hover */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
