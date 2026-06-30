import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

function resolveName(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const candidates = [
    metadata?.full_name,
    metadata?.name,
    metadata?.company_name,
    user.email,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "Usuario";
}

export async function validateCurrentUser(): Promise<AuthUser | null> {
  // Para el gating en cliente usamos la sesión local (instantánea, sin red).
  // `autoRefreshToken` mantiene el token al día y la verificación real del JWT
  // ocurre en el servidor (getCaller) en cada route handler.
  const { data, error } = await supabase.auth.getSession();
  const sessionUser = data.session?.user;

  if (error || !sessionUser) {
    return null;
  }

  const email = sessionUser.email?.trim();
  if (!email) {
    return null;
  }

  return {
    id: sessionUser.id,
    name: resolveName(sessionUser),
    email,
  };
}
