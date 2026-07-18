/**
 * MobileNav Component
 * Full-screen mobile navigation overlay.
 * Slides in from top when hamburger menu is toggled.
 * Closes on link click or explicit close action.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/constants/routes';

interface MobileNavProps {
  /** Whether the mobile nav is currently open */
  isOpen: boolean;
  /** Callback to close the mobile nav */
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="border-t border-outline-variant/30 bg-surface-container-lowest md:hidden">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={cn(
                  'block rounded-md px-4 py-3 text-base font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
