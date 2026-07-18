/**
 * Orders Page
 * Customer order lookup and listing.
 * Guest mode — search by phone number or booking number.
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { OrdersPageClient } from '@/features/orders/components/OrdersPageClient';

export const metadata: Metadata = {
  title: 'My Orders — Track Your Scrap Pickups | Scrapwala',
  description:
    'Look up and track your scrap pickup orders. Search by phone number or booking number to see order status, details, and timeline.',
};

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="My Orders"
        description="Search by phone number or booking number to find your pickups."
      />
      <OrdersPageClient />
    </div>
  );
}
