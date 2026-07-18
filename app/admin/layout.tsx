/**
 * /admin layout
 * Side‑by‑side: AdminSidebar + scrollable content pane.
 */

import type { Metadata } from 'next';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-container">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
