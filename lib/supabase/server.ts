import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server-side Supabase client (for Server Components, Route Handlers, Middleware)
 * Uses cookies for session management
 */
export async function createServerClientInstance() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component - safe to ignore if middleware refreshes
        }
      },
    },
  });
}

/**
 * Lazy Stripe client initialization.
 * Avoids module-load errors when STRIPE_SECRET_KEY is a placeholder.
 */
type StripeClient = import('stripe').default;
let _stripe: StripeClient | null = null;
export function getStripe(): StripeClient {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY is not configured. Add a valid Stripe secret key to enable payments.');
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require('stripe');
  _stripe = new Stripe.default(key, {
    apiVersion: '2024-12-18.acacia',
  }) as StripeClient;
  return _stripe;
}
