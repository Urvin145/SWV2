/**
 * Order Detail Page
 * Full order details with items, timeline, and cancel action.
 */

import type { Metadata } from 'next';
import { OrderDetailClient } from '@/features/orders/components/OrderDetailClient';

export const metadata: Metadata = {
  title: 'Order Details | Scrapwala',
  description: 'View your scrap pickup order details, item breakdown, and status timeline.',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrderDetailClient orderId={id} />;
}
