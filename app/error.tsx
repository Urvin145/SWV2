/**
 * Global Error Page
 * Displayed when an unhandled error occurs.
 * Provides a friendly error message and retry action.
 */

'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    /* Log error to monitoring service in production */
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error-container">
        <AlertTriangle className="h-10 w-10 text-on-error-container" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-on-surface">Something went wrong</h2>
      <p className="mb-8 max-w-md text-on-surface-variant">
        We encountered an unexpected error. Please try again, or contact support if the problem
        persists.
      </p>
      <button
        type="button"
        onClick={reset}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
