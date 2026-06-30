import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en .env",
  );
}

// Remove the stale localStorage entry left by the old createClient.
// createBrowserClient stores the session in cookies, never localStorage,
// so that old key is orphaned and must be evicted on startup.
if (typeof window !== "undefined") {
  try {
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    window.localStorage.removeItem(`sb-${projectRef}-auth-token`);
    window.localStorage.removeItem(`sb-${projectRef}-auth-token-code-verifier`);
  } catch {
    // ignore — storage may be blocked in certain browser modes
  }
}

/**
 * Cliente de Supabase para el navegador. Persiste la sesión en cookies
 * (no localStorage) para que el proxy pueda leerla y hacer routing server-side.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
