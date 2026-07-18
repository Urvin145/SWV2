/**
 * 404 Not Found Page
 * Displayed when a route doesn't match any known page.
 * Includes navigation back to homepage.
 */

import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        <SearchX className="h-10 w-10 text-outline" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-on-surface">Page not found</h2>
      <p className="mb-8 max-w-md text-on-surface-variant">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
        back on track.
      </p>
      <Link
        href={ROUTES.HOME}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
      >
        Back to Home
      </Link>
    </div>
  );
}
