/**
 * SiteLoaderProvider
 * Displays the 3D Mini-Tempo SweetLoader for a mandatory 5 seconds on initial site load.
 * Features real-time status transitions across the 5-second sequence with smooth fade-out.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SweetLoader } from '@/components/common/SweetLoader';

interface SiteLoaderContextType {
  isLoading: boolean;
}

const SiteLoaderContext = createContext<SiteLoaderContextType>({ isLoading: false });

export function useSiteLoader() {
  return useContext(SiteLoaderContext);
}

export function SiteLoaderProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const [statusText, setStatusText] = useState('Starting up electric tempo...');
  const [subText, setSubText] = useState('Calibrating digital scales & vehicle diagnostics');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    const startTime = Date.now();
    const DURATION = 5000; // 5.0 seconds mandatory duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);

      // Status phases across the 5 seconds
      if (elapsed < 1200) {
        setStatusText('Starting up electric tempo...');
        setSubText('Calibrating digital scales & vehicle diagnostics');
      } else if (elapsed < 2600) {
        setStatusText('Checking live scrap rates...');
        setSubText('Fetching verified Bangalore market pricing');
      } else if (elapsed < 4000) {
        setStatusText('Assigning your pickup buddy...');
        setSubText('Connecting with the nearest Scrapwala EV driver');
      } else {
        setStatusText('Doorstep pickup ready!');
        setSubText('Welcome to Scrapwala — Best rates, zero hassle');
      }

      if (elapsed >= DURATION) {
        clearInterval(interval);
        setFading(true);
        // Smooth 500ms exit transition
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <SiteLoaderContext.Provider value={{ isLoading: loading }}>
      {/* Mandatory 5-Second Overlay */}
      {mounted && loading && (
        <div className={`sweet-loader-overlay ${fading ? 'fade-out' : ''}`}>
          <SweetLoader
            message={statusText}
            submessage={subText}
            progressPercent={progress}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`site-content-transition ${loading && !fading ? 'site-content-hidden' : ''}`}>
        {children}
      </div>
    </SiteLoaderContext.Provider>
  );
}
