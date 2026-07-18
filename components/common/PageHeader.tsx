/**
 * PageHeader Component
 * Consistent page header with breadcrumb-style title and optional description.
 * Used at the top of inner pages (Rates, Orders, Book, About, etc.)
 */

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** Page title (h1) */
  title: string;
  /** Optional subtitle/description */
  description?: string;
  /** Additional CSS classes */
  className?: string;
  /** Optional children rendered to the right of the title (e.g., filter buttons) */
  children?: React.ReactNode;
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'border-b border-outline-variant/20 bg-surface-container-low px-4 py-8 sm:px-6 lg:px-8',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-on-surface-variant sm:text-base">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
