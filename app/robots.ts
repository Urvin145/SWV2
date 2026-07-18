/**
 * Robots.txt Generation
 */

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://scrapwala.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/book/completed', '/book/cancelled', '/book/scheduled'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
