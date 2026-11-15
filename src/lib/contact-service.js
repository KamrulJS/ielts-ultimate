/**
 * IELTS Ultimate — Contact Form Submissions Service
 * 
 * Handles client submission of contact inquiries into Supabase 'contact_submissions'
 * with server RLS protection (public insert allowed, admin select allowed).
 */

import { getSupabaseClient } from '@/lib/supabase/client';

const LOCAL_STORAGE_KEY = 'ielts_ultimate_contact_tickets_v1';

export function validateContactInput({ name, email, message }) {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Please provide your name.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('Please provide a message with at least 10 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Submit inquiry to Supabase 'contact_submissions' table.
 */
export async function submitContactInquiry({
  name,
  email,
  subject,
  message,
  phone = null,
  service = null,
  company = null,
  sourcePage = '/contact',
}) {
  const validation = validateContactInput({ name, email, message });
  if (!validation.isValid) {
    return {
      ok: false,
      error: validation.errors[0] || 'Invalid submission data.',
    };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedSubject = subject ? subject.trim() : 'General Inquiry';
  const trimmedMessage = message.trim();
  const trimmedPhone = phone ? phone.trim() : null;
  const trimmedService = service ? service.trim() : null;
  const trimmedCompany = company ? company.trim() : null;
  const source = sourcePage || '/contact';

  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      // Generate client UUID for unambiguous reference tracking without requiring SELECT RLS privileges
      const clientUuid =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
              const r = (Math.random() * 16) | 0;
              const v = c === 'x' ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            });

      const payload = {
        id: clientUuid,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: trimmedSubject,
        message: trimmedMessage,
        service: trimmedService,
        company: trimmedCompany,
        status: 'new',
        source_page: source,
      };

      // Perform direct insert WITHOUT .select() to preserve public anon visitor RLS integrity
      const { error } = await supabase
        .from('contact_submissions')
        .insert([payload]);

      if (error) {
        console.error('Supabase contact submission failed:', error.message);
        return {
          ok: false,
          error: error.message || 'Unable to store contact submission. Please try again.',
        };
      }

      const referenceId = `TKT-${clientUuid.slice(0, 5).toUpperCase()}`;

      // Cache ticket locally for user session display
      if (typeof window !== 'undefined') {
        try {
          const prev = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify([
              {
                id: referenceId,
                uuid: clientUuid,
                name: trimmedName,
                email: trimmedEmail,
                phone: trimmedPhone,
                subject: trimmedSubject,
                message: trimmedMessage,
                service: trimmedService,
                company: trimmedCompany,
                source_page: source,
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              },
              ...prev,
            ])
          );
        } catch {}
      }

      return {
        ok: true,
        id: referenceId,
        uuid: clientUuid,
      };
    } catch (err) {
      console.error('Supabase contact insert exception:', err);
      return {
        ok: false,
        error: err.message || 'A network error occurred while sending your message.',
      };
    }
  }

  // If Supabase client is not available
  return {
    ok: false,
    error: 'Database connection is not configured. Please contact the administrator.',
  };
}

/**
 * Administrator query: fetch all contact submissions (RLS protected, admin only).
 */
export async function fetchContactSubmissions() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, error: 'Supabase client not initialized.', data: [] };
  }

  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { ok: false, error: error.message, data: [] };
    }

    return { ok: true, data: data || [] };
  } catch (err) {
    return { ok: false, error: err.message, data: [] };
  }
}

