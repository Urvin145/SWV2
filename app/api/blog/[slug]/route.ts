/**
 * Single Blog Post API Route Handler
 * GET /api/blog/[slug] — Get a single blog post by slug
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { data: null, error: 'Blog post not found', success: false },
        { status: 404 },
      );
    }

    return NextResponse.json({ data, error: null, success: true });
  } catch (err) {
    console.error('Blog post error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
