import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const nextParam = requestUrl.searchParams.get('next');
  const authError = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error');
  const origin = requestUrl.origin;

  if (authError) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(authError)}`);
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';

  let destination = '/dashboard';

  if (type === 'signup') {
    destination = '/auth/set-password';
  } else if (type === 'recovery') {
    destination = '/auth/reset-password';
  } else if (nextParam && nextParam.startsWith('/')) {
    destination = nextParam;
  }

  if (code && supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Error exchanging code for session:', error.message);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }
    } catch (err) {
      console.error('Auth callback exception:', err);
    }
    return NextResponse.redirect(`${origin}${destination}`);
  }

  // If no PKCE code in query params, client may carry hash tokens (#access_token=...&type=signup)
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Connecting to IELTS Ultimate...</title></head>
<body style="background:#FAF9F5;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="background:#fff;border:1px solid #E2DDD1;padding:32px 36px;text-align:center;">
    <div style="font-weight:600;color:#202020;margin-bottom:6px;">Verifying authentication...</div>
    <div style="font-size:13px;color:#7A756B;">Connecting to IELTS Ultimate</div>
  </div>
  <script>
    (function() {
      var hash = window.location.hash;
      var dest = '${destination}';
      if (hash) {
        var params = new URLSearchParams(hash.substring(1));
        var type = params.get('type');
        if (type === 'signup') dest = '/auth/set-password';
        else if (type === 'recovery') dest = '/auth/reset-password';
        window.location.replace(dest + hash);
      } else {
        window.location.replace(dest);
      }
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
