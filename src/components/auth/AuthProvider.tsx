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
import { getInternal } from "@/lib/session";
import { validateCurrentUser, type AuthUser } from "@/lib/auth-service";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export interface Me {
  email: string | null;
  isSuperAdmin: boolean;
  role: string | null;
  organizationId: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** Perfil del usuario (rol/organización) compartido para evitar pedir /api/me en cada componente. */
  me: Me | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const LOGIN_ROUTE = "/view/loginy";
/** Destino tras login para roles de organización (ADMIN/OPERATOR): la Home con el chat. */
const AFTER_AUTH_ROUTE = "/";
/** El super-admin de plataforma no tiene organización, así que no puede entrar a /view/transfer. */
const SUPERADMIN_AFTER_AUTH_ROUTE = "/view/admin";

function isLoginRoute(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith(LOGIN_ROUTE);
}

function isProtectedRoute(pathname: string | null): boolean {
  return !!pathname && !isLoginRoute(pathname);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");

  // 1) Validar la sesión UNA vez al montar y reaccionar a cambios de auth.
  //    No depende de `pathname`: navegar entre páginas ya no dispara una
  //    petición de red ni vuelve a mostrar la pantalla de "Validando acceso".
  useEffect(() => {
    let active = true;

    async function syncAuthState() {
      const currentUser = await validateCurrentUser();
      if (!active) return;
      setUser(currentUser);
      setStatus(currentUser ? "authenticated" : "unauthenticated");
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

  // 2) Cargar el perfil (/api/me) una sola vez por sesión autenticada y
  //    compartirlo; Sidebar y Home lo consumen sin volver a pedirlo.
  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    getInternal<Me>("/api/me")
      .then((data) => {
        if (active) setMe(data);
      })
      .catch(() => {
        if (active) setMe(null);
      });
    return () => {
      active = false;
    };
  }, [status]);

  // 3) Redirecciones: reaccionan al estado ya conocido + la ruta actual,
  //    sin volver a validar contra la red ni bloquear con la pantalla de carga.
  useEffect(() => {
    if (status === "checking") return;
    if (status === "unauthenticated" && isProtectedRoute(pathname)) {
      router.replace(LOGIN_ROUTE);
      return;
    }
    if (status === "authenticated" && isLoginRoute(pathname)) {
      // Espera a que /api/me cargue: el destino depende de si es super-admin
      // de plataforma (sin organización) o un ADMIN/OPERATOR de una empresa.
      if (me === null) return;
      router.replace(me.isSuperAdmin ? SUPERADMIN_AFTER_AUTH_ROUTE : AFTER_AUTH_ROUTE);
    }
  }, [status, pathname, router, me]);

  return (
    <AuthContext.Provider
      value={{
        user,
        // `me` solo es válido mientras hay sesión: tras cerrarla se descarta
        // sin necesidad de un setState extra dentro del efecto.
        me: status === "authenticated" ? me : null,
        status,
        isAuthenticated: status === "authenticated",
        isChecking: status === "checking",
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
