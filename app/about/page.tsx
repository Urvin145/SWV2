/**
 * About Page
 * Company story, mission, and values section.
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { AboutContent } from '@/features/static/components/AboutContent';

export const metadata: Metadata = {
  title: 'About Us — Our Mission & Story | Scrapwala',
  description:
    'Learn about Scrapwala — our mission to make recycling accessible, transparent, and rewarding for every household and business in Bangalore.',
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Scrapwala"
        description="Making recycling accessible, transparent, and rewarding."
      />
      <AboutContent />
    </div>
  );
}
