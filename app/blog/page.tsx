/**
 * Blog Listing Page
 * Card grid from blog_posts table with SEO metadata.
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { BlogList } from '@/features/blog/components/BlogList';

export const metadata: Metadata = {
  title: 'Blog — Recycling Tips & Industry News | Scrapwala',
  description: 'Read the latest articles about recycling, sustainability, scrap market trends, and tips to reduce waste in your home and office.',
};

export default function BlogPage() {
  return (
    <div>
      <PageHeader title="Blog" description="Recycling tips, industry news, and sustainability stories." />
      <BlogList />
    </div>
  );
}
