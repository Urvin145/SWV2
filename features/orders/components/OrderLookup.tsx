/**
 * OrderLookup Component
 * Phone input OR booking number input with submit button.
 * Allows customers to find their orders without login.
 */

'use client';

import { useState } from 'react';
import { Search, Phone, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderLookupProps {
  onSearch: (params: { phone?: string; number?: string }) => void;
  isLoading?: boolean;
}

export function OrderLookup({ onSearch, isLoading }: OrderLookupProps) {
  const [mode, setMode] = useState<'phone' | 'number'>('phone');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    if (mode === 'phone') {
      onSearch({ phone: value.trim() });
    } else {
      onSearch({ number: value.trim().toUpperCase() });
    }
  };

  return (
    <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm">
      {/* Mode toggle */}
      <div className="mb-5 flex rounded-xl bg-surface-container p-1">
        <button
          onClick={() => { setMode('phone'); setValue(''); }}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
            mode === 'phone'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
        >
          <Phone className="h-4 w-4" />
          By Phone
        </button>
        <button
          onClick={() => { setMode('number'); setValue(''); }}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
            mode === 'number'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface',
          )}
        >
          <Hash className="h-4 w-4" />
          By Booking No.
        </button>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          {mode === 'phone' && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">+91</span>
          )}
          <input
            type={mode === 'phone' ? 'tel' : 'text'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === 'phone' ? '9876543210' : 'SW-20260716-001'}
            maxLength={mode === 'phone' ? 10 : 20}
            className={cn(
              'w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-3 pr-4 text-sm text-on-surface placeholder-on-surface-variant/50 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              mode === 'phone' ? 'pl-12' : 'pl-4',
            )}
          />
        </div>
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={cn(
            'flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all',
            value.trim()
              ? 'bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container'
              : 'cursor-not-allowed bg-surface-container text-on-surface-variant',
          )}
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>
    </div>
  );
}
