import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      '(in .env.local for local dev, or your host\'s Environment Variables settings for deploys). ' +
      'Falling back to a placeholder client — auth and database calls will fail until real values are set.'
  );
}

// Fall back to harmless placeholder values so createClient() never throws during
// a build or static render — a misconfigured deploy fails softly at runtime
// instead of crashing the whole build.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
