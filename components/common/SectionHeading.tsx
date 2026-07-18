/**
 * SectionHeading Component
 * Used within pages to introduce content sections with a heading and optional description.
 */

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Section title (h2) */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Text alignment */
  align?: 'left' | 'center';
  /** Additional CSS classes */
  className?: string;
}

export function SectionHeading({
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <h2 className="font-heading text-xl font-bold text-on-surface sm:text-2xl">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-on-surface-variant sm:text-base">{description}</p>
      )}
    </div>
  );
}
