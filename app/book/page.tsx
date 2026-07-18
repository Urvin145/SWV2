/**
 * Book a Pickup Page
 * Multi-step booking wizard for scheduling a scrap pickup.
 * Guest mode — no authentication required.
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { BookingWizard } from '@/features/booking/components/BookingWizard';

export const metadata: Metadata = {
  title: 'Book a Pickup — Schedule Doorstep Scrap Collection | Scrapwala',
  description:
    'Schedule a doorstep scrap pickup in 4 simple steps. Select your scrap, choose a time, enter details, and confirm. Free pickup, best rates, instant payment.',
  openGraph: {
    title: 'Book a Scrap Pickup — Scrapwala',
    description: 'Schedule doorstep scrap collection in 4 simple steps.',
  },
};

export default function BookPage() {
  return (
    <div>
      <PageHeader
        title="Book a Pickup"
        description="Schedule your doorstep scrap pickup in 4 simple steps."
      />
      <BookingWizard />
    </div>
  );
}
