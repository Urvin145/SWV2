/**
 * Loader Component
 * Standard lightweight inline and page spinner.
 */

'use client';

import { cn } from '@/lib/utils';

interface LoaderProps {
  /** Optional loading message */
  message?: string;
  /** Optional submessage */
  submessage?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const spinnerSizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
} as const;

export function Loader({
  message,
  size = 'md',
  className,
}: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-primary/30 border-t-primary',
          spinnerSizeMap[size],
        )}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-on-surface-variant font-medium">{message}</p>
      )}
    </div>
  );
}
