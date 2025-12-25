// MEATHUB - Search and Filter Utilities

import { MeatProduct } from '../types';

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc';
}

export function searchProducts(products: MeatProduct[], filters: SearchFilters): MeatProduct[] {
  let filtered = [...products];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter(product =>
      product.category === filters.category.toUpperCase()
    );
  }

  // Price range filter
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice!);
  }

  // Stock filter
  if (filters.inStock !== undefined) {
    filtered = filtered.filter(product => product.inStock === filters.inStock);
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        // Would need rating field in product
        filtered.sort((a, b) => (b as any).rating - (a as any).rating || 0);
        break;
    }
  }

  return filtered;
}

export function getCategories(products: MeatProduct[]): string[] {
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories).sort();
}

export function getPriceRange(products: MeatProduct[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  
  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

