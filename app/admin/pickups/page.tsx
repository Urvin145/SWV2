/**
 * Manage Pickups Page (Server Component)
 * /admin/pickups
 */

import type { Metadata } from 'next';
import { AdminPickupsClient } from '@/features/admin/components/AdminPickupsClient';

export const metadata: Metadata = {
  title: 'Manage Pickups',
};

export default function AdminPickupsPage() {
  return <AdminPickupsClient />;
}
