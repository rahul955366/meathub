// MEATHUB - Product Filters Component

import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { SearchFilters } from '../../../utils/searchUtils';
import { MeatCategory } from '../../../types';

interface ProductFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: string[];
  priceRange: { min: number; max: number };
}

export function ProductFilters({ filters, onFiltersChange, categories, priceRange }: ProductFiltersProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <Label>Category</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => onFiltersChange({
              ...filters,
              category: value === 'all' ? undefined : value,
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Min Price</Label>
            <Input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
              })}
              placeholder={`₹${priceRange.min}`}
            />
          </div>
          <div>
            <Label>Max Price</Label>
            <Input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
              })}
              placeholder={`₹${priceRange.max}`}
            />
          </div>
        </div>

        {/* Stock Filter */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock ?? false}
            onCheckedChange={(checked) => onFiltersChange({
              ...filters,
              inStock: checked ? true : undefined,
            })}
          />
          <Label htmlFor="inStock" className="cursor-pointer">
            In Stock Only
          </Label>
        </div>

        {/* Sort By */}
        <div>
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy || 'name-asc'}
            onValueChange={(value: any) => onFiltersChange({
              ...filters,
              sortBy: value,
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={() => onFiltersChange({})}
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </Card>
  );
}

