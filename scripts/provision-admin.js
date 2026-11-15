/**
 * IELTS Ultimate — Administrator Provisioning Script
 * 
 * Usage:
 *   node scripts/provision-admin.js <admin-email> <admin-password>
 * 
 * Example:
 *   node scripts/provision-admin.js admin@ieltsultimate.edu SecureAdminPassword2026!
 * 
 * Or set environment variables in .env.local:
 *   SUPABASE_ADMIN_EMAIL=admin@ieltsultimate.edu
 *   SUPABASE_ADMIN_PASSWORD=SecureAdminPassword2026!
 *   node scripts/provision-admin.js
 */

if (!globalThis.WebSocket) {
  globalThis.WebSocket = class {};
}

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local or .env if present
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const full = path.resolve(process.cwd(), file);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
      break;
    }
  }
}

loadEnv();

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminEmail =
  process.argv[2] ||
  process.env.SUPABASE_ADMIN_EMAIL ||
  'admin@ieltsultimate.edu';

const adminPassword =
  process.argv[3] ||
  process.env.SUPABASE_ADMIN_PASSWORD ||
  'AdminUltimate2026!';

async function run() {
  console.log('----------------------------------------------------');
  console.log('IELTS Ultimate — Administrator Provisioning Utility');
  console.log('----------------------------------------------------');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('ERROR: Missing Supabase configuration!');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file.');
    console.error('Never commit SUPABASE_SERVICE_ROLE_KEY to source control.');
    process.exit(1);
  }

  if (serviceRoleKey.includes('your-service-role-secret-key')) {
    console.error('ERROR: Placeholder service role key detected in environment.');
    console.error('Please provide your real Supabase Service Role Key from Project Settings -> API.');
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Connecting to: ${supabaseUrl}`);
  console.log(`Provisioning Admin Account: ${adminEmail}`);

  try {
    // 1. Check if user already exists
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      throw listError;
    }

    const existingUser = usersData.users.find(
      (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
    );

    let userId = null;

    if (existingUser) {
      console.log(`User already exists (ID: ${existingUser.id}). Promoting to administrator role...`);
      userId = existingUser.id;

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          password: adminPassword,
          email_confirm: true,
          app_metadata: { role: 'admin' },
          user_metadata: { full_name: 'Platform Administrator' },
        }
      );

      if (updateError) throw updateError;
      console.log('✓ Successfully updated user credentials and app_metadata.role to "admin".');
    } else {
      console.log('Creating new administrator account...');
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        app_metadata: { role: 'admin' },
        user_metadata: { full_name: 'Platform Administrator' },
      });

      if (createError) throw createError;
      userId = createData.user.id;
      console.log(`✓ Successfully created administrator user (ID: ${userId}).`);
    }

    // 2. Synchronize to public.profiles table
    if (userId) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email: adminEmail,
          full_name: 'Platform Administrator',
          role: 'admin',
          track: 'Academic',
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.warn('Note: Could not upsert into public.profiles directly (ensure schema.sql has been executed):', profileError.message);
      } else {
        console.log('✓ Synchronized administrator role in public.profiles table.');
      }
    }

    console.log('----------------------------------------------------');
    console.log('ADMINISTRATOR ACCOUNT READY:');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     admin (stored in secure app_metadata)`);
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('Provisioning failed:', err.message || err);
    process.exit(1);
  }
}

run();

