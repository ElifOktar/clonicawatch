import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ──────────────────────────────────────────────
// Build-safe Supabase clients
// Environment variables are NOT available during Vercel build ("Collecting page data" phase).
// All clients use lazy initialization to prevent build-time crashes.
// ──────────────────────────────────────────────

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anonKey };
}

// Returns true if Supabase env vars are available (runtime), false during build
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getEnv();
  return Boolean(url && anonKey);
}

let _publicClient: SupabaseClient | null = null;

// Public client — read-only (RLS enforced). Returns null if env vars missing (build time).
export function getPublicClient(): SupabaseClient | null {
  if (_publicClient) return _publicClient;
  const { url, anonKey } = getEnv();
  if (!url || !anonKey) return null;
  _publicClient = createClient(url, anonKey);
  return _publicClient;
}

// Backward compat: `import { supabase } from "@/lib/supabase"`
// Proxy delays client creation until first property access (runtime).
// During build, property access returns a dummy that makes queries return empty results.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getPublicClient();
    if (!client) {
      // Build time — return a chainable dummy so queries resolve to empty arrays
      // instead of throwing errors
      if (prop === "from") {
        return () => {
          const chain: any = {
            select: () => chain,
            eq: () => chain,
            neq: () => chain,
            in: () => chain,
            order: () => chain,
            limit: () => chain,
            single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured (build time)" } }),
            then: (resolve: any) => resolve({ data: [], error: null }),
          };
          // Make chain thenable for direct await
          chain[Symbol.toStringTag] = "SupabaseBuildDummy";
          return chain;
        };
      }
      return undefined;
    }
    return (client as any)[prop];
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
