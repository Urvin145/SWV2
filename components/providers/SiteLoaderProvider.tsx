/**
 * SiteLoaderProvider
 *
 * Enforces a mandatory 3-second (3000ms) 3D Electric Tempo loader animation on:
 * 1. Initial page load (app mount)
 * 2. EVERY route transition / page navigation (Home, Rates, Book, Orders, FAQ, Contact, Blog, etc.)
 *
 * Synchronized with the 3.0s SweetLoader animation cycle + dynamic status text + smooth fade transition.
 */

'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SweetLoader } from '@/components/common/SweetLoader';

interface SiteLoaderContextType {
  isLoading: boolean;
  triggerLoader: (customMessage?: string, durationMs?: number) => void;
}

const SiteLoaderContext = createContext<SiteLoaderContextType>({
  isLoading: false,
  triggerLoader: () => {},
});

export function useSiteLoader() {
  return useContext(SiteLoaderContext);
}

const DURATION = 3000; // 3.0 seconds mandatory gap

export function SiteLoaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const [statusText, setStatusText] = useState('Starting up electric tempo...');
  const [subText, setSubText] = useState('Calibrating digital scales & vehicle diagnostics');
  const [progress, setProgress] = useState(0);

  const prevPathRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runLoaderSequence = (customMsg?: string, durationMs = DURATION) => {
    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setLoading(true);
    setFading(false);
    setProgress(0);

    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      // Dynamic 3-stage status updates across the 3 seconds
      if (customMsg) {
        setStatusText(customMsg);
        setSubText('Scrapwala Doorstep Collection');
      } else if (elapsed < 1000) {
        setStatusText('Starting up electric tempo...');
        setSubText('Calibrating digital scales & vehicle diagnostics');
      } else if (elapsed < 2000) {
        setStatusText('Assigning your pickup buddy...');
        setSubText('Connecting with nearest Scrapwala executive');
      } else {
        setStatusText('Doorstep pickup ready!');
        setSubText('Welcome to Scrapwala — Best rates, zero hassle');
      }

      if (elapsed >= durationMs) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setFading(true);
        // 400ms smooth fade transition
        timerRef.current = setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    }, 30);
  };

  // 1. Initial page load trigger
  useEffect(() => {
    setMounted(true);
    prevPathRef.current = pathname;
    runLoaderSequence();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 2. Trigger mandatory 3-second loader on EVERY page navigation
  useEffect(() => {
    if (!mounted) return;

    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      // Scroll to top upon page navigation
      window.scrollTo(0, 0);
      runLoaderSequence();
    }
  }, [pathname, mounted]);

  return (
    <SiteLoaderContext.Provider
      value={{
        isLoading: loading,
        triggerLoader: runLoaderSequence,
      }}
    >
      {/* Mandatory 3-Second Fullscreen Overlay on Every Page Load */}
      {mounted && loading && (
        <div className={`sweet-loader-overlay ${fading ? 'fade-out' : ''}`}>
          <SweetLoader
            message={statusText}
            submessage={subText}
            progressPercent={progress}
          />
        </div>
      )}

      {/* Page Content with smooth transition */}
      <div className={`site-content-transition ${loading && !fading ? 'site-content-hidden' : ''}`}>
        {children}
      </div>
    </SiteLoaderContext.Provider>
  );
}
