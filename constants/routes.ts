/**
 * Route Constants
 * Centralized route definitions for type-safe navigation throughout the app.
 * Always use these constants instead of hardcoded strings.
 */

export const ROUTES = {
  /** Homepage — hero, rates preview, how it works */
  HOME: '/',

  /** Scrap rates browser with category filtering */
  RATES: '/rates',

  /** Multi-step booking wizard */
  BOOK: '/book',

  /** Booking status pages */
  BOOK_COMPLETED: '/book/completed',
  BOOK_SCHEDULED: '/book/scheduled',
  BOOK_CANCELLED: '/book/cancelled',

  /** Order lookup and details */
  ORDERS: '/orders',
  ORDER_DETAILS: (id: string) => `/orders/${id}` as const,

  /** Static / content pages */
  ABOUT: '/about',
  FAQ: '/faq',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}` as const,
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

/** Navigation links used in Header and Footer */
export const NAV_LINKS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Scrap Rates', href: ROUTES.RATES },
  { label: 'Book Pickup', href: ROUTES.BOOK },
  { label: 'Track Order', href: ROUTES.ORDERS },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'FAQ', href: ROUTES.FAQ },
  { label: 'Contact', href: ROUTES.CONTACT },
] as const;

/** Footer-only navigation links */
export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: ROUTES.ABOUT },
    { label: 'Blog', href: ROUTES.BLOG },
    { label: 'Contact', href: ROUTES.CONTACT },
  ],
  legal: [
    { label: 'Privacy Policy', href: ROUTES.PRIVACY },
    { label: 'Terms of Service', href: ROUTES.TERMS },
  ],
  services: [
    { label: 'Scrap Rates', href: ROUTES.RATES },
    { label: 'Book Pickup', href: ROUTES.BOOK },
    { label: 'Track Order', href: ROUTES.ORDERS },
  ],
} as const;
