/**
 * Blog Post Detail Page
 * Dynamic route for individual blog posts with Schema.org BlogPosting.
 */

import type { Metadata } from 'next';
import { BlogPostClient } from '@/features/blog/components/BlogPostClient';

export const metadata: Metadata = {
  title: 'Blog Post | Scrapwala',
  description: 'Read this article about recycling, sustainability, and the scrap industry.',
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
