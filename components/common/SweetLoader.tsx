/**
 * SweetLoader — Eco-Friendly Mini-Tempo Scrap Pickup Animation
 *
 * Storyboard (3.0-second cycle):
 * 1. (0:00) Modern green electric mini-tempo approaches curbside scrap
 * 2. (0:01) Tempo parks smoothly next to the scrap pile
 * 3. (0:02) Scrap items jump in a parabolic arc over the open truck bed
 * 4. (0:02.5) Items land neatly into truck bed with glowing eco-sparkles
 * 5. (0:03) Loaded tempo accelerates away off-screen, leaving a clean curb
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import './sweet-loader.css';

export interface SweetLoaderProps {
  /** Main message below the animation */
  message?: string;
  /** Optional secondary subtitle */
  submessage?: string;
  /** Explicit progress percentage (0-100) */
  progressPercent?: number;
  /** Whether to render with a full-screen centered backdrop */
  fullScreen?: boolean;
  /** Additional wrapper CSS classes */
  className?: string;
}

export function SweetLoader({
  message = 'Assigning your pickup buddy...',
  submessage = 'Finding the nearest Scrapwala electric vehicle in your area',
  progressPercent,
  fullScreen = false,
  className,
}: SweetLoaderProps) {
  const isDeterministic = typeof progressPercent === 'number';

  const content = (
    <div className={cn('sweet-loader-card', className)} role="status" aria-live="polite">
      {/* 3D Animated Mini Stage */}
      <div className="mini-stage">
        {/* Sky / Environment clouds */}
        <div className="eco-cloud cloud-1" aria-hidden="true" />
        <div className="eco-cloud cloud-2" aria-hidden="true" />

        {/* Road & Ground */}
        <div className="ground-line">
          <div className="road-stripes" />
        </div>

        {/* Curbside Scrap Box */}
        <div className="sweet-box" aria-hidden="true">
          <div className="box-inner">
            <span className="box-emoji">📦</span>
            <div className="box-shadow" />
          </div>
        </div>

        {/* Modern Electric Mini Tempo */}
        <div className="truck-assembly" aria-hidden="true">
          {/* Eco Sparkle on Pickup */}
          <div className="eco-sparkle">
            <span className="sparkle-star s1">✨</span>
            <span className="sparkle-star s2">🌱</span>
            <span className="sparkle-star s3">⚡</span>
          </div>

          {/* Truck Body / Chassis */}
          <div className="chassis">
            {/* Open Truck Bed with Scrap Container */}
            <div className="truck-bed">
              <div className="bed-fill">
                <span className="bed-cargo">📦</span>
              </div>
              <div className="bed-rails" />
              <div className="brand-badge">ECO</div>
            </div>

            {/* Modern Aerodynamic Cab */}
            <div className="cab">
              <div className="tinted-window">
                <div className="driver-silhouette" />
              </div>
              <div className="led-headlight">
                <div className="light-beam" />
              </div>
              <div className="grille-accent" />
            </div>
          </div>

          {/* Wheels */}
          <div className="tyre rear-tyre">
            <div className="wheel-rim" />
          </div>
          <div className="tyre front-tyre">
            <div className="wheel-rim" />
          </div>

          {/* Underglow & Exhaust */}
          <div className="truck-underglow" />
        </div>
      </div>

      {/* Dynamic Animated Status Label */}
      <div className="sweet-label-wrapper">
        <span className="sweet-label">{message}</span>
        {submessage && <p className="sweet-sublabel">{submessage}</p>}
      </div>

      {/* Progress Meta */}
      {isDeterministic && (
        <div className="sweet-progress-meta">
          <span>Eco Engine</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
      )}

      {/* Progress Track */}
      <div className="loader-progress-track">
        <div
          className={cn('loader-progress-bar', !isDeterministic && 'animated-pulse')}
          style={isDeterministic ? { width: `${Math.max(4, Math.min(100, progressPercent))}%` } : undefined}
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="sweet-loader-overlay">
        {content}
      </div>
    );
  }

  return content;
}
