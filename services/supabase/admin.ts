/**
 * Supabase Admin Client (Service Role)
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS.
 * Only use in server-side API routes, never expose to the client.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const createAdminClient = () => {
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
