/**
 * Contact API Route Handler
 * POST /api/contact — Submit a contact form
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';
import { contactFormSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate request body
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          data: null,
          error: result.error.issues.map((e) => e.message).join(', '),
          success: false,
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert(result.data)
      .select()
      .single();

    if (error) {
      console.error('Contact submission error:', error);
      return NextResponse.json(
        { data: null, error: 'Failed to submit contact form', success: false },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { data, error: null, success: true },
      { status: 201 },
    );
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { data: null, error: 'Internal server error', success: false },
      { status: 500 },
    );
  }
}
