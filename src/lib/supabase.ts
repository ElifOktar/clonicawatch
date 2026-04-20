import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization — prevents "supabaseUrl is required" error during Vercel build
// Environment variables are only available at runtime, not build time

let _publicClient: SupabaseClient | null = null;

// Public client — read-only (RLS enforced)
export function getPublicClient(): SupabaseClient {
  if (!_publicClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
    }
    _publicClient = createClient(url, key);
  }
  return _publicClient;
}

// Keep backward compat — some files import `supabase` directly
// This getter delays creation until first use (runtime, not build time)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getPublicClient() as any)[prop];
  },
});

// Admin client — full access (server-side only, never expose to browser)
export function getAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// Helper: Supabase Storage public URL
export function getStorageUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${url}/storage/v1/object/public/product-images/${path}`;
}
