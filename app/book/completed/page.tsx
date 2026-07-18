/**
 * Booking Completed Page
 * Displayed after a booking is successfully created.
 * Shows booking number and summary.
 */

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata = {
  title: 'Booking Completed',
};

export default function BookCompletedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-on-surface">Booking Completed!</h1>
      <p className="mb-8 max-w-md text-on-surface-variant">
        Your pickup has been scheduled successfully. You will receive a confirmation shortly.
      </p>
      <div className="flex gap-4">
        <Link
          href={ROUTES.ORDERS}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          Track My Order
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
