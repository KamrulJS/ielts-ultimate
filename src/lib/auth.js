export const AUTH_STORAGE_KEY = 'ielts_ultimate_auth_v1';
export const ACCOUNTS_STORAGE_KEY = 'ielts_ultimate_accounts_v1';

export const DEMO_STUDENT_CREDENTIALS = {
  email: 'emily.johnson@ieltsultimate.edu',
  password: 'IELTS2026!',
  name: 'Emily Johnson',
  role: 'student',
};

export const DEMO_ADMIN_CREDENTIALS = {
  email: 'admin@ieltsultimate.edu',
  password: 'AdminUltimate2026!',
  name: 'Platform Admin',
  role: 'admin',
};

export const UNAUTHENTICATED_STATE = {
  isAuthenticated: false,
  role: null,
  email: null,
  name: null,
};

export function sanitizeNextPath(rawPath, fallback = '/dashboard') {
  if (typeof rawPath !== 'string') return fallback;
  const trimmed = rawPath.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }
  return trimmed;
}

export function isRoleAuthorized(auth, requiredRole = 'student') {
  if (!auth?.isAuthenticated) return false;
  if (requiredRole === 'admin') {
    return auth.role === 'admin';
  }
  return auth.role === 'student' || auth.role === 'admin';
}

