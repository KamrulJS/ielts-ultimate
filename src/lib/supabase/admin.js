if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  globalThis.WebSocket = class {};
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export const isSupabaseAdminConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseServiceRoleKey &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseServiceRoleKey.includes('your-service-role-secret-key')
  );
};

let adminInstance = null;

export function getSupabaseAdmin() {
  if (adminInstance) return adminInstance;

  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  adminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminInstance;
}

