/**
 * Booking Cancelled Page
 * Displayed when a booking has been cancelled.
 */

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata = {
  title: 'Booking Cancelled',
};

export default function BookCancelledPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error-container">
        <XCircle className="h-10 w-10 text-error" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-on-surface">Booking Cancelled</h1>
      <p className="mb-8 max-w-md text-on-surface-variant">
        Your booking has been cancelled. You can schedule a new pickup anytime.
      </p>
      <div className="flex gap-4">
        <Link
          href={ROUTES.BOOK}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          Book New Pickup
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
