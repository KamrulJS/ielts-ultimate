if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  globalThis.WebSocket = class {};
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseAnonKey.includes('your-anon-public-api-key')
  );
};

let clientInstance = null;

export function getSupabaseClient() {
  if (clientInstance) return clientInstance;

  if (!isSupabaseConfigured()) {
    // Return a dummy client in development so builds and SSR prerendering succeed
    // without throwing unhandled exceptions before credentials are supplied.
    return null;
  }

  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'ielts_ultimate_supabase_auth',
    },
  });

  return clientInstance;
}

export const supabase = isSupabaseConfigured()
  ? getSupabaseClient()
  : null;

