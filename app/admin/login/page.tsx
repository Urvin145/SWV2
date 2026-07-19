/**
 * Admin Login Page
 * /admin/login — Simple login form with username/password
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recycle, Loader2, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (json.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(json.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface via-surface-container-low to-surface-container p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Recycle className="h-7 w-7 text-on-primary" />
          </div>
          <h1 className="text-xl font-bold text-on-surface">
            Scrap<span className="text-primary">wala</span>
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">Admin Panel Login</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-lg"
        >
          <div className="mb-5 flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-on-surface">Sign In</h2>
          </div>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-on-surface-variant">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoFocus
                  required
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface-container py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-xl border border-outline-variant/30 bg-surface-container py-2.5 pl-10 pr-11 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-lg bg-error-container/50 px-3 py-2 text-xs font-medium text-on-error-container">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-on-primary shadow-sm hover:bg-primary-container transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-on-surface-variant/60">
          Protected area · Authorized access only
        </p>
      </div>
    </div>
  );
}
