import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

export interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
    className?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean;
}

const variantStyles = {
    primary: 'bg-[image:var(--primary-gradient)] text-white shadow-lg shadow-[--primary-dark]/30 hover:shadow-xl hover:shadow-[--primary-dark]/40',
    secondary: 'bg-white text-[--primary] border-2 border-[--primary] hover:bg-[--primary] hover:text-white',
    gold: 'bg-[image:var(--gradient-gold)] text-white shadow-lg shadow-[--gold-dark]/40 hover:shadow-xl hover:shadow-[--gold]/50',
    outline: 'bg-transparent text-[--primary] border-2 border-[--primary] hover:bg-[--primary]/5',
    ghost: 'bg-transparent text-[--primary] hover:bg-[--primary]/10',
};

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
};

export function PremiumButton({
    variant = 'primary',
    size = 'md',
    children,
    className,
    leftIcon,
    rightIcon,
    loading = false,
    disabled,
    ...props
}: PremiumButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full font-[family-name:var(--font-accent)] font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </motion.button>
    );
}

// Specific button variants for common use cases
export function AddToCartButton(props: Omit<PremiumButtonProps, 'variant'>) {
    return <PremiumButton variant="primary" {...props} />;
}

export function BuyNowButton(props: Omit<PremiumButtonProps, 'variant'>) {
    return <PremiumButton variant="gold" size="lg" {...props} />;
}

export function ViewDetailsButton(props: Omit<PremiumButtonProps, 'variant'>) {
    return <PremiumButton variant="outline" {...props} />;
}
