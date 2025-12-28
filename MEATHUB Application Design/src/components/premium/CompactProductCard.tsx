import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LunchBoxCardProps {
    id: number | string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating?: number;
    isFresh?: boolean;
    isBestseller?: boolean;
    isPremium?: boolean;
    weight?: string;
    onAddToCart?: (id: number | string) => void;
    onClick?: (id: number | string) => void;
    className?: string;
}

export function LunchBoxCard({
    id,
    name,
    description,
    price,
    originalPrice,
    image,
    rating,
    isFresh = false,
    isBestseller = false,
    isPremium = false,
    weight,
    onAddToCart,
    onClick,
    className,
}: LunchBoxCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAdding(true);
        await onAddToCart?.(id);
        setTimeout(() => setIsAdding(false), 800);
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
            whileHover={{ y: -4 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onClick?.(id)}
            className={cn(
                'group relative cursor-pointer',
                className
            )}
        >
            {/* Lunch Box Container - COMPACT SIZE */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-3 border-gray-300 shadow-lg overflow-visible p-2">

                {/* HANDLE on TOP - Smaller */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-16 h-6 flex items-end justify-center">
                    <div className="w-full h-4 border-3 border-gray-400 rounded-t-[20px] bg-gradient-to-b from-gray-200 to-gray-300 shadow">
                        <div className="flex justify-evenly items-center h-full px-1.5">
                            <div className="w-px h-2 bg-gray-400/50 rounded"></div>
                            <div className="w-px h-2 bg-gray-400/50 rounded"></div>
                            <div className="w-px h-2 bg-gray-400/50 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Lock/Clasp - Smaller */}
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-20 w-4 h-2 bg-gray-400 rounded-t border border-gray-500"></div>

                {/* Tag - Smaller */}
                <motion.div
                    animate={{ rotate: [0, -2, 2, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center"
                >
                    <div className="w-px h-2 bg-amber-700/40"></div>
                    <div className="px-1.5 py-0.5 bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[8px] font-bold rounded shadow">
                        {isPremium ? '⭐' : (isBestseller ? '🔥' : (isFresh ? '🌿' : '✨'))}
                    </div>
                </motion.div>

                {/* WINDOW - Smaller, shows product */}
                <div className="relative bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-inner">

                    {/* Window frame effect */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Corner screws/rivets */}
                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-gray-300 border border-gray-400"></div>
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gray-300 border border-gray-400"></div>
                        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gray-300 border border-gray-400"></div>
                        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-gray-300 border border-gray-400"></div>
                    </div>

                    {/* Product Image - Compact size */}
                    <div className="relative w-full aspect-square">
                        {/* Badges in window - Smaller */}
                        <div className="absolute top-1 left-1 z-10 flex flex-col gap-0.5">
                            {isFresh && (
                                <span className="px-1.5 py-0.5 bg-green-500 text-white text-[8px] font-bold rounded-full shadow-sm">
                                    Fresh
                                </span>
                            )}
                            {discount > 0 && (
                                <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full shadow-sm">
                                    {discount}%
                                </span>
                            )}
                        </div>

                        {/* Like button - Smaller */}
                        <button
                            onClick={handleLike}
                            className={cn(
                                'absolute top-1 right-1 z-10 p-1 rounded-full backdrop-blur-sm transition-all text-xs',
                                isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'
                            )}
                        >
                            <Heart className={cn('w-3 h-3', isLiked && 'fill-current')} />
                        </button>

                        <motion.img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover p-1.5"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                </div>

                {/* LABEL SECTION - Compact */}
                <div className="mt-1.5 px-1.5 py-1.5 bg-white rounded-md border border-gray-200">
                    <h3 className="font-semibold text-xs text-foreground line-clamp-1 mb-0.5">{name}</h3>

                    <div className="flex items-center gap-1.5 mb-1">
                        {weight && <span className="text-[10px] text-muted-foreground">{weight}</span>}
                        {rating && (
                            <div className="flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                <span className="text-[10px] font-medium">{rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-primary">₹{price}</span>
                            {originalPrice && originalPrice > price && (
                                <span className="text-[9px] text-muted-foreground line-through">₹{originalPrice}</span>
                            )}
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={cn(
                                'px-2 py-1 rounded text-[10px] font-semibold transition-all',
                                isPremium ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' : 'bg-primary text-white'
                            )}
                        >
                            {isAdding ? '...' : 'Add'}
                        </motion.button>
                    </div>
                </div>

                {/* Side latches - Smaller */}
                <div className="absolute top-1/2 -left-0.5 w-1 h-4 bg-gray-400 rounded-r border border-gray-500"></div>
                <div className="absolute top-1/2 -right-0.5 w-1 h-4 bg-gray-400 rounded-l border border-gray-500"></div>
            </div>

            {/* Shimmer Effect on Hover */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-2xl"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Export as CompactProductCard for compatibility
export { LunchBoxCard as CompactProductCard };
