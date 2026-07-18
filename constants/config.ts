/**
 * Application Configuration
 * Global configuration constants for the Scrapwala app.
 */

export const APP_CONFIG = {
  /** Application name displayed across the UI */
  name: 'Scrapwala',

  /** Tagline used in hero sections and metadata */
  tagline: 'Uber for Scrap Collection',

  /** Full description for SEO metadata */
  description:
    'Schedule doorstep scrap pickups for your household, apartment, office, or factory. Get the best rates for paper, plastic, metal, e-waste, and more.',

  /** Base URL for the application */
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  /** Contact information */
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91-XXXXXXXXXX',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX',
    email: 'hello@scrapwala.com',
  },

  /** Social media links */
  social: {
    instagram: 'https://instagram.com/scrapwala',
    twitter: 'https://twitter.com/scrapwala',
    facebook: 'https://facebook.com/scrapwala',
  },

  /** Booking configuration */
  booking: {
    /** Number of days ahead customers can book */
    maxAdvanceDays: 7,
    /** Booking number prefix */
    numberPrefix: 'SW',
  },

  /** Default city for rates */
  defaultCity: 'Bangalore',
} as const;
