/**
 * BlogList Component
 * Client-side blog post card grid fetched from /api/blog.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CalendarDays, ArrowRight, Clock } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { formatDate } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch('/api/blog');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export function BlogList() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-surface-container" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="py-20 text-center text-on-surface-variant">No blog posts yet. Check back soon!</p>
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Cover placeholder */}
                <div className="flex h-40 items-center justify-center rounded-t-xl bg-gradient-to-br from-primary/10 to-primary-fixed/20">
                  <span className="text-4xl">📝</span>
                </div>
                <div className="p-5">
                  <h3 className="mb-2 line-clamp-2 font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(post.published_at ?? post.created_at)}
                    </div>
                    <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
