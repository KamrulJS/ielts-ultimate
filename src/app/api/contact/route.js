import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Helper to ensure server environment variables are available even if next dev
// was started before .env.local was created or modified.
function resolveServerSupabase() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf8');
        raw.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [k, ...rest] = trimmed.split('=');
            const v = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
            if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL' && !url) url = v;
            if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY' && !key) key = v;
            if (k.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' && !key) key = v;
          }
        });
      }
    } catch {}
  }

  if (url && key) {
    return createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return getSupabaseAdmin();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      message,
      subject,
      phone,
      service,
      company,
      sourcePage = '/contact',
    } = body || {};

    // 1. Validation
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';
    const trimmedSubject = typeof subject === 'string' ? subject.trim() : 'General Inquiry';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : null;
    const trimmedService = typeof service === 'string' ? service.trim() : null;
    const trimmedCompany = typeof company === 'string' ? company.trim() : null;
    const source = typeof sourcePage === 'string' ? sourcePage.trim() : '/contact';

    if (!trimmedName) {
      return NextResponse.json({ ok: false, error: 'Please provide your name.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      return NextResponse.json({ ok: false, error: 'Please provide a message with at least 10 characters.' }, { status: 400 });
    }

    // 2. Resolve database client
    const supabase = resolveServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: 'Database connection is not configured on the server.' },
        { status: 500 }
      );
    }

    // 3. Generate record ID
    const submissionId = crypto.randomUUID();
    const payload = {
      id: submissionId,
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

    // 4. Secure insert into Supabase contact_submissions table
    const { error } = await supabase.from('contact_submissions').insert([payload]);

    if (error) {
      console.error('Supabase server insert error:', error);
      return NextResponse.json(
        { ok: false, error: error.message || 'Failed to record contact submission.' },
        { status: 500 }
      );
    }

    const referenceId = `TKT-${submissionId.slice(0, 5).toUpperCase()}`;

    return NextResponse.json({
      ok: true,
      id: referenceId,
      uuid: submissionId,
    });
  } catch (err) {
    console.error('API /api/contact handler error:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Internal server error while submitting inquiry.' },
      { status: 500 }
    );
  }
}

