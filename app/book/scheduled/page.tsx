/**
 * Booking Scheduled Page
 * Displayed when a booking has been scheduled for pickup.
 */

import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata = {
  title: 'Booking Scheduled',
};

export default function BookScheduledPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container">
        <CalendarCheck className="h-10 w-10 text-secondary" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-on-surface">Pickup Scheduled</h1>
      <p className="mb-8 max-w-md text-on-surface-variant">
        Your pickup has been scheduled. Our executive will arrive at the scheduled time.
      </p>
      <div className="flex gap-4">
        <Link
          href={ROUTES.ORDERS}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          View My Orders
        </Link>
        <Link
          href={ROUTES.HOME}
          className="rounded-lg border border-outline-variant px-6 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
