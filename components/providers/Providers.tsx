/**
 * Providers
 * Wraps the application with:
 * 1. TanStack React Query Provider
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  /**
   * Create QueryClient inside useState to ensure it's only created once per
   * client-side render and not shared between requests on the server.
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /* Data is considered fresh for 5 minutes */
            staleTime: 5 * 60 * 1000,
            /* Keep unused cache for 10 minutes */
            gcTime: 10 * 60 * 1000,
            /* Don't retry on 4xx errors */
            retry: (failureCount, error) => {
              if (error instanceof Error && error.message.includes('4')) return false;
              return failureCount < 2;
            },
            /* Don't refetch on window focus for better mobile UX */
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
