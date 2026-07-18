/**
 * Blog API Route Handler
 * GET /api/blog — List all published blog posts
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, author_name, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Blog fetch error:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch blog posts', success: false },
        { status: 500 },
      );
    }

    return NextResponse.json({ data, error: null, success: true });
  } catch (err) {
    console.error('Blog API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
