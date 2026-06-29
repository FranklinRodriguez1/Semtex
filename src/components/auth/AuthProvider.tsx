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

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isChecking: boolean;
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

  useEffect(() => {
    let active = true;

    async function syncAuthState() {
      setIsChecking(true);

      const currentUser = await validateCurrentUser();
      if (!active) {
        return;
      }

      setUser(currentUser);
      setStatus(currentUser ? "authenticated" : "unauthenticated");

      if (!currentUser && isProtectedRoute(pathname)) {
        router.replace(LOGIN_ROUTE);
      } else if (currentUser && isLoginRoute(pathname)) {
        router.replace(AFTER_AUTH_ROUTE);
      }

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
  }, [pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAuthenticated: status === "authenticated",
        isChecking,
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
