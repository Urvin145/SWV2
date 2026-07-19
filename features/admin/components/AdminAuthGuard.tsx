/**
 * AdminAuthGuard
 * Client component that checks for an admin session cookie.
 * If not authenticated, redirects to /admin/login.
 * Shows a loading spinner while checking.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Skip guard on the login page itself
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      setAuthenticated(true); // let the login page render
      return;
    }

    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session');
        const json = await res.json();

        if (json.authenticated) {
          setAuthenticated(true);
        } else {
          router.replace('/admin/login');
        }
      } catch {
        router.replace('/admin/login');
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [isLoginPage, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
