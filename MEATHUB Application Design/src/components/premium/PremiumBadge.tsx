import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

export interface PremiumBadgeProps {
    variant?: 'gold' | 'fresh' | 'copper' | 'burgundy' | 'bestseller';
    children: React.ReactNode;
    className?: string;
    animated?: boolean;
}

const variantStyles = {
    gold: 'bg-[image:var(--gradient-gold)] text-white shadow-lg shadow-[--gold-dark]/30',
    fresh: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md animate-pulse',
    copper: 'bg-[image:var(--gradient-copper)] text-white shadow-md',
    burgundy: 'bg-[image:var(--primary-gradient)] text-white shadow-md shadow-[--primary-dark]/30',
    bestseller: 'bg-[--gold] text-white shadow-lg shadow-[--gold]/40 border border-[--gold-light]/50',
};

export function PremiumBadge({
    variant = 'gold',
    children,
    className,
    animated = false
}: PremiumBadgeProps) {
    const badgeContent = (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-accent)] font-bold uppercase tracking-wider',
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );

    if (animated) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
            >
                {badgeContent}
            </motion.div>
        );
    }

    return badgeContent;
}

// Specific badge variants for common use cases
export function FreshBadge({ className }: { className?: string }) {
    return (
        <PremiumBadge variant="fresh" className={className} animated>
            🌿 Fresh
        </PremiumBadge>
    );
}

export function BestsellerBadge({ className }: { className?: string }) {
    return (
        <PremiumBadge variant="bestseller" className={className} animated>
            ⭐ Bestseller
        </PremiumBadge>
    );
}

export function PremiumTag({ className }: { className?: string }) {
    return (
        <PremiumBadge variant="gold" className={className} animated>
            ✨ Premium
        </PremiumBadge>
    );
}

export function SpecialBadge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <PremiumBadge variant="copper" className={className} animated>
            {children}
        </PremiumBadge>
    );
}
