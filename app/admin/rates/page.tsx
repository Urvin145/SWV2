/**
 * Edit Rates Page (Server Component)
 * /admin/rates
 */

import type { Metadata } from 'next';
import { AdminRatesClient } from '@/features/admin/components/AdminRatesClient';

export const metadata: Metadata = {
  title: 'Edit Rates',
};

export default function AdminRatesPage() {
  return <AdminRatesClient />;
}
