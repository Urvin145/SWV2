/**
 * AdminSidebar
 * Persistent vertical sidebar for the admin panel.
 * Links: Dashboard, Manage Pickups, Edit Rates, Return to Site.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Truck,
  IndianRupee,
  ArrowLeft,
  Recycle,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pickups', label: 'Manage Pickups', icon: Truck },
  { href: '/admin/rates', label: 'Edit Rates', icon: IndianRupee },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const navContent = (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Recycle className="h-5 w-5 text-on-primary" />
        </div>
        <div>
          <span className="text-lg font-bold text-on-surface">
            Scrap<span className="text-primary">wala</span>
          </span>
          <p className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-outline-variant/15" />

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
              )}
            >
              <Icon className={cn('h-4.5 w-4.5', active ? 'text-primary' : 'text-on-surface-variant')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Site + Logout */}
      <div className="border-t border-outline-variant/15 px-3 py-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest shadow-md lg:hidden"
        aria-label="Toggle admin sidebar"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-scrim/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: static, mobile: slide-over */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-outline-variant/15 bg-surface-container-lowest transition-transform lg:static lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
