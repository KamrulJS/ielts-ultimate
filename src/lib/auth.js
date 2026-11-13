export {
  AUTH_STORAGE_KEY,
  ACCOUNTS_STORAGE_KEY,
  REMEMBERED_IDENTIFIER_KEY,
  DEMO_STUDENT_CREDENTIALS,
  DEMO_ADMIN_CREDENTIALS,
  UNAUTHENTICATED_STATE,
  authenticateUser,
  registerNewUser,
  requestPasswordReset,
  hashPassword,
  verifyPassword,
  getRegisteredAccounts,
  saveRegisteredAccounts,
} from './auth-service';

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
