import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';

/**
 * Check if live Supabase Auth is enabled and configured
 */
export function isLiveAuthAvailable() {
  return isSupabaseConfigured();
}

/**
 * Helper to get the canonical base URL for OAuth and email redirect callbacks
 */
export function getAppOrigin() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

/**
 * 1. Email Registration Flow (Section 3.A)
 * Sends an email verification / password setup magic link without requiring password upfront.
 */
export async function sendEmailRegistrationLink({
  email = '',
  name = '',
  targetBand = '7.5',
  track = 'Academic',
}) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      error: 'Supabase authentication is not configured yet. Please configure your .env.local file.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const origin = getAppOrigin();

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${origin}/auth/callback?type=signup&next=/auth/set-password`,
        shouldCreateUser: true,
        data: {
          full_name: cleanName || cleanEmail.split('@')[0],
          name: cleanName,
          target_band: targetBand,
          track: track,
        },
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return {
      ok: true,
      email: cleanEmail,
      message: 'Verification email dispatched. Please check your inbox.',
      data,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'An unexpected error occurred sending the verification email.',
    };
  }
}

/**
 * 2. Sign In with Email & Password (Section 4)
 */
export async function signInWithEmailPassword({ email = '', password = '' }) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      error: 'Supabase credentials are not configured in environment variables.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return {
      ok: false,
      error: 'Please enter both your email address and password.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        return {
          ok: false,
          unverified: true,
          email: cleanEmail,
          error: 'Your email address has not been verified yet. Please check your inbox or request a new link.',
        };
      }
      return { ok: false, error: error.message || 'Invalid email or password.' };
    }

    const user = data.user;
    const profile = await fetchUserProfile(user.id);
    const session = normalizeUserSession(user, profile);

    return {
      ok: true,
      success: true,
      user: session,
      role: session.role,
      rawSession: data.session,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'An unexpected authentication error occurred.',
    };
  }
}

/**
 * 3. Sign In with Google OAuth 2.0 (Section 3.B)
 */
export async function signInWithGoogleOAuth(redirectTo = '/dashboard') {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      error: 'Supabase credentials are not configured in environment variables.',
    };
  }

  const origin = getAppOrigin();
  const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    return { ok: true, url: data.url };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'Failed to initiate Google authentication.',
    };
  }
}

/**
 * 4. Request Password Reset Link (Section 4)
 */
export async function sendPasswordResetLink(email) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      error: 'Supabase credentials are not configured in environment variables.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const origin = getAppOrigin();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${origin}/auth/callback?type=recovery&next=/auth/reset-password`,
    });

    if (error) throw error;
    return {
      ok: true,
      message: 'Password reset link sent! Please check your email inbox.',
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'Failed to send password reset instructions.',
    };
  }
}

/**
 * 5. Update / Set New Password (Used by /auth/set-password and /auth/reset-password)
 */
export async function saveUserPassword(newPassword) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      error: 'Supabase credentials are not configured in environment variables.',
    };
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      ok: false,
      error: 'Password must be at least 6 characters long.',
    };
  }

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    const user = data.user;
    const profile = await fetchUserProfile(user.id);
    const session = normalizeUserSession(user, profile);

    return {
      ok: true,
      user: session,
      role: session.role,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'Failed to update account password.',
    };
  }
}

/**
 * 6. Resend Verification Email
 */
export async function resendVerificationEmail(email) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      error: 'Supabase credentials are not configured in environment variables.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const origin = getAppOrigin();

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: {
        emailRedirectTo: `${origin}/auth/callback?type=signup&next=/auth/set-password`,
      },
    });

    if (error) {
      // If error suggests OTP or magic link
      return sendEmailRegistrationLink({ email: cleanEmail });
    }

    return { ok: true, message: 'Verification link resent to your inbox.' };
  } catch (err) {
    return {
      ok: false,
      error: err.message || 'Failed to resend verification email.',
    };
  }
}

/**
 * 7. Fetch user profile from public.profiles table
 */
export async function fetchUserProfile(userId) {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Could not fetch user profile from profiles table:', error.message);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * 8. Normalize Supabase user + profile into IELTS Ultimate session object
 */
export function normalizeUserSession(user, profile = null) {
  if (!user) return null;

  // Strict RBAC: Check app_metadata.role first (server managed), fallback to profile.role
  const rawRole =
    user.app_metadata?.role ||
    profile?.role ||
    'user';

  const role = rawRole === 'admin' ? 'admin' : 'student';

  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Student';

  const avatar =
    profile?.avatar_url ||
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  return {
    isAuthenticated: true,
    id: user.id,
    email: user.email,
    username: user.email?.split('@')[0] || 'student',
    name: fullName,
    avatar,
    role,
    track: profile?.track || user.user_metadata?.track || 'Academic',
    targetBand: profile?.target_band || user.user_metadata?.target_band || 7.5,
  };
}

/**
 * 9. Sign Out cleanly from Supabase
 */
export async function signOutSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return { ok: true };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

