/**
 * Admin Dashboard Page (Server Component)
 * /admin — Renders the client-side dashboard with KPI cards, charts, and recent bookings
 */

import type { Metadata } from 'next';
import { AdminDashboardClient } from '@/features/admin/components/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
