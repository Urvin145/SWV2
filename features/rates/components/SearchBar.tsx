/**
 * SearchBar Component
 * Debounced search input for filtering scrap items by name.
 * Features: search icon, clear button, debounced onChange.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search scrap items...',
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [value, setValue] = useState('');

  // Debounced callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-on-surface-variant" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-3 pl-11 pr-10 text-sm text-on-surface placeholder-on-surface-variant/50 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {value.length > 0 && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
