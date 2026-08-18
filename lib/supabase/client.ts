import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side Supabase client (safe - uses anon key only)
 * Never expose service role key in browser
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    cookies: {
      getAll() {
        return document.cookie.split('; ').map((c) => {
          const [name, ...value] = c.split('=');
          return { name, value: value.join('=') };
        });
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = `${name}=${value}; path=/; ${
            options?.maxAge ? `max-age=${options.maxAge};` : ''
          } ${options?.secure ? 'secure;' : ''} ${
            options?.sameSite ? `samesite=${options.sameSite};` : ''
          }`;
        });
      },
    },
  });
}
