import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client — read-only (RLS enforced)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — full access (server-side only, never expose to browser)
export function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// Helper: Supabase Storage public URL
export function getStorageUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/product-images/${path}`;
}
