/**
 * BlogPostClient Component
 * Fetches and renders a single blog post by slug.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { AnimatedSection } from '@/components/common/AnimatedSection';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
}

async function fetchPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`/api/blog/${slug}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export function BlogPostClient({ slug }: { slug: string }) {
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchPost(slug),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-surface-container" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-surface-container" />
          <div className="h-4 w-48 animate-pulse rounded bg-surface-container" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="h-4 w-full animate-pulse rounded bg-surface-container" />))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="mb-4 text-on-surface-variant">Post not found.</p>
        <Link href="/blog" className="font-medium text-primary hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimatedSection>
        <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <h1 className="mb-4 font-heading text-3xl font-bold leading-tight text-on-surface sm:text-4xl">
          {post.title}
        </h1>

        <div className="mb-8 flex items-center gap-4 text-sm text-on-surface-variant">
          {post.author && (
            <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {formatDate(post.published_at ?? post.created_at)}
          </span>
        </div>

        {/* Render markdown content as HTML-safe text */}
        <article className="prose prose-sm max-w-none text-on-surface-variant prose-headings:text-on-surface prose-a:text-primary prose-strong:text-on-surface">
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </article>
      </AnimatedSection>
    </div>
  );
}
