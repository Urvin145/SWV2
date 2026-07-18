/**
 * Header Component
 * Main navigation header for the Scrapwala application.
 * Features: Logo, navigation links, "Book Pickup" CTA, mobile hamburger menu.
 * Responsive: Desktop shows full nav, mobile shows hamburger → MobileNav.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, NAV_LINKS } from '@/constants/routes';
import { MobileNav } from './MobileNav';

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Recycle className="h-5 w-5 text-on-primary" />
          </div>
          <span className="font-heading text-xl font-bold text-on-surface">
            Scrap<span className="text-primary">wala</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.filter((link) => link.href !== ROUTES.BOOK).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          {/* Book Pickup CTA — always visible */}
          <Link
            href={ROUTES.BOOK}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-md active:scale-[0.98]"
          >
            Book Pickup
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-on-surface-variant md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
