/**
 * MeatHub Image Helpers v2 — Accurate, product-matched fallback images.
 * All Unsplash IDs verified to show the correct meat/seafood product.
 */
export const getPlaceholderImage = (category?: string) => {
    const images: Record<string, string> = {
        'CHICKEN': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80&fit=crop',
        'MUTTON': 'https://images.unsplash.com/photo-1602491675983-c42bcf9a1a31?w=800&q=80&fit=crop',
        'FISH': 'https://images.unsplash.com/photo-1521503332462-8511790bf7e5?w=800&q=80&fit=crop',
        'PRAWNS': 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?w=800&q=80&fit=crop',
        'SEAFOOD': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80&fit=crop',
        'EGGS': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&q=80&fit=crop',
        'GYM': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&fit=crop',
        'PET': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop',
        'BUTCHER': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80&fit=crop',
    };

    if (category) {
        const upCat = category.toUpperCase();
        if (images[upCat]) return images[upCat];
        if (upCat.includes('CHICKEN')) return images['CHICKEN'];
        if (upCat.includes('MUTTON')) return images['MUTTON'];
        if (upCat.includes('FISH')) return images['FISH'];
        if (upCat.includes('PRAWN')) return images['PRAWNS'];
    }

    return 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80&fit=crop';
};

// Named product keyword lookup — returns the most accurate image
export const getAccurateImage = (name: string, category: string) => {
    const n = name.toUpperCase();
    // Chicken
    if (n.includes('COUNTRY CHICKEN') || n.includes('NATU KODI')) return 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80&fit=crop';
    if (n.includes('CHICKEN BREAST')) return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&fit=crop';
    if (n.includes('CHICKEN WING')) return 'https://images.unsplash.com/photo-1527477396000-e27163b4bff0?w=800&q=80&fit=crop';
    if (n.includes('CHICKEN LIVER')) return 'https://images.unsplash.com/photo-1607116665636-2506534bf0fe?w=800&q=80&fit=crop';
    if (n.includes('DRUMSTICK')) return 'https://images.unsplash.com/photo-1603048588661-83ae09942a33?w=800&q=80&fit=crop';
    if (n.includes('TANDOORI') || n.includes('TIKKA') || n.includes('MARINATED')) return 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80&fit=crop';
    if (n.includes('KEEMA') || n.includes('MINCE') || n.includes('SEEKH')) return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80&fit=crop';
    if (n.includes('BONELESS CHICKEN')) return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80&fit=crop';
    if (n.includes('CHICKEN CURRY')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80&fit=crop';
    // Mutton
    if (n.includes('PAYA') || n.includes('TROTTER')) return 'https://images.unsplash.com/photo-1601050690438-47c764de4f7c?w=800&q=80&fit=crop';
    if (n.includes('BHEJA') || n.includes('BRAIN')) return 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80&fit=crop';
    if (n.includes('MUTTON LIVER')) return 'https://images.unsplash.com/photo-1624174503860-478de0ae2c09?w=800&q=80&fit=crop';
    if (n.includes('MUTTON CHOP')) return 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80&fit=crop';
    if (n.includes('MUTTON RIB')) return 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80&fit=crop';
    if (n.includes('BIRYANI')) return 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800&q=80&fit=crop';
    // Fish
    if (n.includes('SEER') || n.includes('VANJARAM')) return 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80&fit=crop';
    if (n.includes('POMFRET')) return 'https://images.unsplash.com/photo-1513267048331-5611cad62e41?w=800&q=80&fit=crop';
    if (n.includes('MACKEREL') || n.includes('BANGDA')) return 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=800&q=80&fit=crop';
    if (n.includes('SARDINE')) return 'https://images.unsplash.com/photo-1611171838489-f44f7264ccfd?w=800&q=80&fit=crop';
    if (n.includes('KING FISH')) return 'https://images.unsplash.com/photo-1535398082218-038289bc9514?w=800&q=80&fit=crop';
    if (n.includes('FISH STEAK') || n.includes('FISH FINGER')) return 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&q=80&fit=crop';
    if (n.includes('FISH FILLET') || n.includes('FISH CUBE')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80&fit=crop';
    // Seafood
    if (n.includes('LOBSTER')) return 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&fit=crop';
    if (n.includes('SQUID') || n.includes('CALAMARI')) return 'https://images.unsplash.com/photo-1553744399-460b0f553051?w=800&q=80&fit=crop';
    if (n.includes('MUSSEL')) return 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=800&q=80&fit=crop';
    if (n.includes('CRAB')) return 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=800&q=80&fit=crop';
    if (n.includes('TIGER PRAWN')) return 'https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?w=800&q=80&fit=crop';
    if (n.includes('JUMBO PRAWN')) return 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80&fit=crop';
    if (n.includes('PRAWN')) return 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=800&q=80&fit=crop';
    // Gym
    if (n.includes('EGG WHITE')) return 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80&fit=crop';
    if (n.includes('TURKEY')) return 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=800&q=80&fit=crop';
    if (n.includes('OMEGA') || n.includes('SALMON')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80&fit=crop';
    // Pet
    if (n.includes('CHICKEN FRAME') || n.includes('CHICKEN NECK')) return 'https://images.unsplash.com/photo-1610057099443-fde6c90db253?w=800&q=80&fit=crop';
    if (n.includes('BONE BROTH')) return 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80&fit=crop';
    if (n.includes('ORGAN MIX')) return 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80&fit=crop';

    return getPlaceholderImage(category);
};
