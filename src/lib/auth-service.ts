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
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const email = data.user.email?.trim();
  if (!email) {
    return null;
  }

  return {
    id: data.user.id,
    name: resolveName(data.user),
    email,
  };
}
