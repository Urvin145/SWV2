/**
 * Navbar Mini Animation Component
 * Sits at the very top of the header.
 * Responsive Layout:
 * - Mobile: Only the centered mini-tempo scrap animation is visible
 * - Desktop/Tablet:
 *   - Left: Promotional / eco guarantee text
 *   - Center: Animated mini-tempo truck collecting scrap & dropping coins
 *   - Right: Social media icons (Instagram, Facebook, X/Twitter, WhatsApp)
 */

'use client';

import { APP_CONFIG } from '@/constants/config';
import './navbar-mini-truck.css';

// Crisp SVG social icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function NavbarMiniAnimation() {
  const whatsappUrl = `https://wa.me/${APP_CONFIG.contact.whatsapp}?text=Hi%20Scrapwala%2C%20I%20have%20a%20query%20about%20scrap%20pickup.`;

  return (
    <div className="navbar-top-track relative overflow-hidden border-b border-primary/15 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white select-none">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 text-xs">
        
        {/* 1. Left Side: Text descriptor (Hidden on mobile, visible on desktop/tablet) */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-emerald-200/90 whitespace-nowrap flex-shrink-0">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Scrap collected • Instant UPI cash paid • 100% recycled</span>
        </div>

        {/* 2. Center: Animated Truck & Scrap Stage (Full width & centered on mobile) */}
        <div className="flex items-center justify-center w-full md:flex-1 overflow-hidden px-1 sm:px-4">
          <div className="nav-mini-stage relative h-7 w-64 sm:w-80 flex-shrink-0 mx-auto">
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
        </div>

        {/* 3. Right Side: Social Media Icons (Hidden on mobile, visible on desktop/tablet) */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <a
            href={APP_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-200/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={APP_CONFIG.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-200/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={APP_CONFIG.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-200/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <TwitterXIcon className="h-3 w-3" />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Support"
            className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-300 transition-all hover:bg-white/10 hover:text-emerald-200"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
