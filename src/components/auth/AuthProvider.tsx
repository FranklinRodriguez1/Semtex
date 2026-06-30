"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { validateCurrentUser, type AuthUser } from "@/lib/auth-service";
import { getInternal } from "@/lib/session";

interface Me {
  email: string | null;
  isSuperAdmin: boolean;
  role: string | null;
  organizationId: string | null;
}

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isChecking: boolean;
  role: string | null;
  isSuperAdmin: boolean;
  organizationId: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const LOGIN_ROUTE = "/view/loginy";
const AFTER_AUTH_ROUTE = "/view/transfer";

function isLoginRoute(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith(LOGIN_ROUTE);
}

function isProtectedRoute(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith("/view/") && !isLoginRoute(pathname);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [isChecking, setIsChecking] = useState(true);
  const [me, setMe] = useState<Me | null>(null);

  // Runs ONCE on mount + on real Supabase auth events (login/logout).
  // pathname is intentionally excluded — navigation must not re-trigger a full auth check.
  useEffect(() => {
    let active = true;

    async function syncAuthState() {
      setIsChecking(true);

      // Both calls run in parallel: getUser() validates server-side, /api/me fetches role.
      const [currentUser, meData] = await Promise.all([
        validateCurrentUser(),
        getInternal<Me>("/api/me").catch(() => null),
      ]);

      if (!active) return;

      setMe(currentUser ? meData : null);
      setUser(currentUser ?? null);
      setStatus(currentUser ? "authenticated" : "unauthenticated");
      setIsChecking(false);
    }

    void syncAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncAuthState();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Redirect logic reacts to auth status OR pathname changes — does not re-validate auth.
  useEffect(() => {
    if (isChecking) return;
    if (!user && isProtectedRoute(pathname)) {
      router.replace(LOGIN_ROUTE);
    } else if (user && isLoginRoute(pathname)) {
      router.replace(AFTER_AUTH_ROUTE);
    }
  }, [status, pathname, router, isChecking, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAuthenticated: status === "authenticated",
        isChecking,
        role: me?.role ?? null,
        isSuperAdmin: me?.isSuperAdmin ?? false,
        organizationId: me?.organizationId ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}
