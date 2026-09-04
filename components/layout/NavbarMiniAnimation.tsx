/**
 * Navbar Mini Animation Component
 * Sits at the very top of the header.
 * Storyboard:
 * 1. Cute electric mini-tempo truck drives in and parks beside curbside scrap pile.
 * 2. Scrap items jump in a parabolic arc into the truck bed.
 * 3. Golden coins and cash drop/pop with sparkles as instant customer payout.
 * 4. Loaded truck speeds away to the right with eco-leaves, leaving the spot clean.
 */

'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import './navbar-mini-truck.css';

export function NavbarMiniAnimation() {
  return (
    <div className="navbar-top-track relative overflow-hidden border-b border-primary/15 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white select-none">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 text-xs">
        
        {/* Left / Center Animation Stage */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="nav-mini-stage relative h-7 w-72 sm:w-80 flex-shrink-0">
            {/* Curbside Ground Track */}
            <div className="nav-ground-line" />

            {/* Curbside Scrap Pile (Waits for truck, then jumps in!) */}
            <div className="nav-scrap-cluster">
              <span className="nav-scrap-item nav-scrap-box" title="Cardboard">📦</span>
              <span className="nav-scrap-item nav-scrap-paper" title="Newspaper">📰</span>
              <span className="nav-scrap-item nav-scrap-metal" title="Metal Can">🥫</span>
            </div>

            {/* Mini Electric Tempo Truck */}
            <div className="nav-truck-unit">
              {/* Cab & Cargo Body */}
              <div className="nav-truck-body">
                {/* Truck Cargo Bed with green accents */}
                <div className="nav-truck-bed">
                  <span className="nav-bed-text">SCRAP</span>
                  {/* Scrap items resting inside after jump */}
                  <div className="nav-loaded-scrap">📦</div>
                </div>

                {/* Truck Cab */}
                <div className="nav-truck-cab">
                  <div className="nav-truck-window" />
                  <div className="nav-truck-light" />
                </div>
              </div>

              {/* Rolling Wheels */}
              <div className="nav-wheel nav-wheel-front" />
              <div className="nav-wheel nav-wheel-back" />
              <div className="nav-eco-leaf">🍃</div>
            </div>

            {/* Money Dropper Effect (Rupee Coins & Cash pop up when scrap is loaded!) */}
            <div className="nav-money-fountain">
              <span className="nav-coin nav-coin-1">🪙</span>
              <span className="nav-coin nav-coin-2">₹</span>
              <span className="nav-coin nav-coin-3">💸</span>
              <span className="nav-sparkle">✨</span>
            </div>
          </div>

          {/* Micro text descriptor on larger screens */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-medium text-emerald-200/90">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Scrap collected • Instant UPI cash paid • 100% recycled</span>
          </div>
        </div>

        {/* Right Action Pill */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={ROUTES.BOOK}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-400/30 transition-all hover:scale-105"
          >
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span className="hidden sm:inline">Sell Today:</span>
            <span className="text-white font-bold">Best Bangalore Rates</span>
            <ArrowRight className="h-3 w-3 text-emerald-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
