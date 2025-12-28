import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ComboTray {
    name: string;
    image: string;
    weight: string;
}

export interface ComboLunchBoxProps {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    originalPrice?: number;
    trays: ComboTray[]; // 3 trays
    savings?: string;
    badge?: string;
    onAddToCart?: (id: string) => void;
    className?: string;
}

export function ComboLunchBox({
    id,
    title,
    subtitle,
    price,
    originalPrice,
    trays,
    savings,
    badge = "Today's Special",
    onAddToCart,
    className,
}: ComboLunchBoxProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        await onAddToCart?.(id);
        setTimeout(() => setIsAdding(false), 800);
    };

    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn('group relative cursor-pointer', className)}
        >
            {/* CARRIAGE/TIFFIN CARRIER DESIGN - Vertically Stacked */}
            <div className="relative">

                {/* HANDLE with CLASP - Top carrying handle */}
                <div className="relative flex justify-center mb-2">
                    {/* Center clasp that holds the tiffins together */}
                    <div className="relative w-16 h-16 z-30">
                        {/* Handle arc */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-12 border-t-8 border-l-8 border-r-8 border-b-0 border-gray-400 rounded-t-[40px] bg-gradient-to-b from-gray-300 to-gray-400 shadow-lg"></div>

                        {/* Clasp mechanism in center */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-gray-500 to-gray-600 rounded-lg border-4 border-gray-400 shadow-xl z-40 flex flex-col items-center justify-center">
                            <div className="w-6 h-1 bg-gray-300 rounded mb-0.5"></div>
                            <div className="w-6 h-1 bg-gray-300 rounded"></div>
                        </div>

                        {/* Swinging tag from handle */}
                        <motion.div
                            animate={{ rotate: [0, -3, 3, -3, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-2 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
                        >
                            <div className="w-px h-3 bg-amber-700/60"></div>
                            <div className="px-2 py-0.5 bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[10px] font-bold rounded shadow-lg flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                {badge}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Header Section - On first tiffin lid */}
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl border-4 border-gray-300 border-b-2 shadow-md px-4 py-3 mb-px">
                    <h3 className="text-lg font-bold text-gray-800 font-[family-name:var(--font-heading)] text-center mb-1">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-600 text-center">{subtitle}</p>

                    {/* Rim/lip detail */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400 rounded-b"></div>
                </div>

                {/* 3 STACKED TIFFIN CONTAINERS */}
                <div className="space-y-px">
                    {trays.map((tray, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ x: 2 }}
                            className={cn(
                                "relative bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border-4 border-gray-300 shadow-lg",
                                index === 0 && "border-t-2", // Less top border since it connects to lid
                                index === trays.length - 1 && "rounded-b-2xl" // Round bottom of last tiffin
                            )}
                        >
                            {/* Horizontal layout - Image left, details right */}
                            <div className="flex items-center gap-3 p-3">

                                {/* Left side - Circular tray number badge */}
                                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-primary-dark">
                                    {index + 1}
                                </div>

                                {/* Product Image - Square with rounded corners */}
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-inner">
                                    <img
                                        src={tray.image}
                                        alt={tray.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">
                                        {tray.name}
                                    </p>
                                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                        {tray.weight}
                                    </span>
                                </div>

                                {/* Right side rim detail */}
                                <div className="w-1 h-full bg-gray-300 rounded"></div>
                            </div>

                            {/* Bottom rim of each tiffin */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-400"></div>

                            {/* Side clips/hinges */}
                            <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-6 bg-gray-400 rounded-r border-2 border-gray-500 shadow"></div>
                            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-6 bg-gray-400 rounded-l border-2 border-gray-500 shadow"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom base/stand */}
                <div className="relative bg-gradient-to-b from-gray-200 to-gray-300 rounded-b-2xl border-4 border-gray-300 border-t-0 shadow-xl px-4 py-4 mt-px">

                    {/* Pricing & Add Section */}
                    <div className="bg-white rounded-xl p-3 shadow-inner border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            {/* Price */}
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-primary">₹{price}</span>
                                    {originalPrice && (
                                        <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                                    )}
                                </div>
                                {savings && (
                                    <p className="text-xs text-green-600 font-semibold">Save {savings}</p>
                                )}
                            </div>

                            {/* Discount */}
                            {discount > 0 && (
                                <div className="px-2.5 py-1 bg-red-500 text-white text-sm font-bold rounded-full shadow">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Add Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            {isAdding ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Add Combo
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Base rim */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-400 rounded-b-xl"></div>
                </div>

                {/* Vertical connecting rod/clasp on the side - like real tiffin carriers */}
                <div className="absolute top-16 -right-2 bottom-4 w-2 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-400 rounded-full border-2 border-gray-600 shadow-lg z-20"></div>
                <div className="absolute top-16 -left-2 bottom-4 w-2 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-400 rounded-full border-2 border-gray-600 shadow-lg z-20"></div>
            </div>

            {/* Shimmer */}
            {isHovered && (
                <motion.div
                    initial={{ y: '-100%' }}
                    animate={{ y: '100%' }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none rounded-2xl"
                />
            )}
        </motion.div>
    );
}
