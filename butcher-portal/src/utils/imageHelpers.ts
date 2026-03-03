/**
 * Utility to provide high-quality fallback images for MeatHub.
 * Uses Unsplash based on category or default placeholder if not available.
 */
export const getPlaceholderImage = (category?: string, secondary?: boolean) => {
    const images: Record<string, string> = {
        'CHICKEN': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=800&auto=format&fit=crop',
        'MUTTON': 'https://images.unsplash.com/photo-1549487950-8488339c636f?q=80&w=800&auto=format&fit=crop',
        'FISH': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
        'EGGS': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=800&auto=format&fit=crop',
        'PRAWNS': 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?q=80&w=800&auto=format&fit=crop',
        'SEAFOOD': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=800&auto=format&fit=crop',
        'GYM': 'https://images.unsplash.com/photo-1583084323671-6780c74bd2c3?q=80&w=800&auto=format&fit=crop', // Liver is high-protein/gym icon
        'PET': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop',
        'BUTCHER': 'https://images.unsplash.com/photo-1593922312613-2d189196324d?q=80&w=800&auto=format&fit=crop'
    };

    const defaultImages = [
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594041680534-e8c8cdebd679?q=80&w=800&auto=format&fit=crop'
    ];

    if (category) {
        const upCat = category.toUpperCase();
        if (images[upCat]) return images[upCat];

        // Partial matches
        if (upCat.includes('CHICKEN')) return images['CHICKEN'];
        if (upCat.includes('MUTTON')) return images['MUTTON'];
        if (upCat.includes('FISH')) return images['FISH'];
    }

    return secondary ? defaultImages[1] : defaultImages[0];
};

export const getAccurateImage = (name: string, category: string) => {
    // If the name is specific enough, we can return a tailored image
    const n = name.toUpperCase();
    if (n.includes('POTLAM')) return 'https://images.unsplash.com/photo-1601000341032-da3079979b9a?q=80&w=800&auto=format&fit=crop';
    if (n.includes('BRAIN')) return 'https://images.unsplash.com/photo-1608039829572-e24850138733?q=80&w=800&auto=format&fit=crop';
    if (n.includes('LIVER')) return 'https://images.unsplash.com/photo-1583084323671-6780c74bd2c3?q=80&w=800&auto=format&fit=crop';
    if (n.includes('PAYA') || n.includes('TROTTER')) return 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800&auto=format&fit=crop';
    if (n.includes('PRAWN')) return 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?q=80&w=800&auto=format&fit=crop';

    return getPlaceholderImage(category);
};
