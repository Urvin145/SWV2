/**
 * EmptyState Component
 * Displayed when a list or search has no results.
 * Includes an icon, title, description, and optional action button.
 */

import { cn } from '@/lib/utils';
import { PackageOpen, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  /** Icon to display (defaults to PackageOpen) */
  icon?: LucideIcon;
  /** Heading text */
  title: string;
  /** Description text */
  description?: string;
  /** Optional action button */
  action?: {
    label: string;
    href: string;
  };
  /** Additional CSS classes */
  className?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
        <Icon className="h-8 w-8 text-outline" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-on-surface-variant">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
