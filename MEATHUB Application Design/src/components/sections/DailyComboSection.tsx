import React from 'react';
import { ComboLunchBox } from '../premium/ComboLunchBox';
import { toast } from 'sonner';

export function DailyComboSection() {
    const handleAddCombo = async (id: string) => {
        toast.success('Combo added to cart!', {
            description: 'Your daily special combo has been added',
            duration: 2000,
        });
    };

    const dailyCombos = [
        {
            id: 'combo-family',
            title: '🏠 Family Pack',
            subtitle: 'Perfect for 4-5 people',
            price: 899,
            originalPrice: 1199,
            savings: '₹300',
            badge: "Bestseller",
            trays: [
                {
                    name: 'Chicken Wings',
                    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300',
                    weight: '500g'
                },
                {
                    name: 'Mutton Mince',
                    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=300',
                    weight: '250g'
                },
                {
                    name: 'Fresh Fish',
                    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300',
                    weight: '300g'
                }
            ]
        },
        {
            id: 'combo-protein',
            title: '💪 Protein Power',
            subtitle: 'For fitness enthusiasts',
            price: 749,
            originalPrice: 999,
            savings: '₹250',
            badge: "⭐ Premium",
            trays: [
                {
                    name: 'Chicken Breast',
                    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300',
                    weight: '500g'
                },
                {
                    name: 'Turkey Slices',
                    image: 'https://images.unsplash.com/photo-1629944037881-f83c63f29e7e?w=300',
                    weight: '200g'
                },
                {
                    name: 'Lean Mutton',
                    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=300',
                    weight: '300g'
                }
            ]
        },
        {
            id: 'combo-seafood',
            title: '🦐 Seafood Delight',
            subtitle: 'Ocean fresh goodness',
            price: 1099,
            originalPrice: 1399,
            savings: '₹300',
            badge: "🌿 Fresh",
            trays: [
                {
                    name: 'Jumbo Prawns',
                    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300',
                    weight: '400g'
                },
                {
                    name: 'Fish Fillet',
                    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300',
                    weight: '500g'
                },
                {
                    name: 'Squid Rings',
                    image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc768?w=300',
                    weight: '250g'
                }
            ]
        }
    ];

    return (
        <section className="py-12 bg-gradient-to-b from-amber-50/50 to-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-foreground mb-3">
                        Today's Special Combos
                    </h2>
                    <p className="text-lg text-muted-foreground mb-2">
                        Handpicked combinations for your daily needs
                    </p>
                    <div className="w-32 h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 mx-auto rounded-full"></div>
                </div>

                {/* 3 Combo Lunch Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                    {dailyCombos.map((combo) => (
                        <ComboLunchBox
                            key={combo.id}
                            {...combo}
                            onAddToCart={handleAddCombo}
                        />
                    ))}
                </div>

                {/* Trust Badge */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full shadow-md border-2 border-primary/20">
                        <span className="text-2xl">✓</span>
                        <p className="text-sm font-medium text-gray-700">
                            <span className="font-bold text-primary">100% Fresh</span> • Cut on Order • Temperature Controlled Delivery
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
