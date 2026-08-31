/**
 * Loader Component
 * Supports both modern 3D Electric Tempo animation (SweetLoader) and lightweight inline spinner.
 */

'use client';

import { cn } from '@/lib/utils';
import { SweetLoader } from './SweetLoader';

export { SweetLoader };

interface LoaderProps {
  /** Optional loading message */
  message?: string;
  /** Optional submessage */
  submessage?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Display variant: 'truck' (default for page loads) or 'spinner' (for small inline elements) */
  variant?: 'truck' | 'spinner';
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
  submessage,
  size = 'md',
  variant = 'truck',
  className,
}: LoaderProps) {
  if (variant === 'truck' || size === 'lg') {
    return (
      <SweetLoader
        message={message || 'Assigning your pickup buddy...'}
        submessage={submessage}
        className={className}
      />
    );
  }

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
