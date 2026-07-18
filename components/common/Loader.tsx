/**
 * Loader Component
 * Animated loading spinner with optional text.
 * Uses the primary brand color for the spinner animation.
 */

import { cn } from '@/lib/utils';

interface LoaderProps {
  /** Optional loading message displayed below the spinner */
  message?: string;
  /** Size variant of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
} as const;

export function Loader({ message, size = 'md', className }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-primary/30 border-t-primary',
          sizeMap[size],
        )}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-on-surface-variant">{message}</p>
      )}
    </div>
  );
}
