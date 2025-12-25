// MEATHUB - Search Bar Component

import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-10 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}

