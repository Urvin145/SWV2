/**
 * StatusBadge Component
 * Displays a colored badge for booking statuses.
 * Color mapping is driven by the BOOKING_STATUS_CONFIG from common types.
 */

import { cn } from '@/lib/utils';
import { type BookingStatus, BOOKING_STATUS_CONFIG } from '@/types/common.types';

interface StatusBadgeProps {
  /** The booking status to display */
  status: BookingStatus;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  destructive: 'bg-red-100 text-red-700',
  secondary: 'bg-surface-container-high text-on-surface-variant',
} as const;

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = BOOKING_STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantStyles[config.variant],
        className,
      )}
    >
      {config.label}
    </span>
  );
}
