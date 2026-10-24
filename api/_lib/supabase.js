// Shared Supabase connection for the API files.
// Files and folders that start with "_" are NOT turned into API routes by Vercel.

import { createClient } from '@supabase/supabase-js';

let client = null;

export function getSupabase() {
  if (client) return client; // reuse the same connection

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env (local) or to Vercel (live).');
  }

  // The service role key can skip Row Level Security.
  // That is safe here because this code only runs on the server, never in the browser.
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
