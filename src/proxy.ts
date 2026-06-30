import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LOGIN_ROUTE = "/view/loginy";
const AFTER_AUTH_ROUTE = "/view/transfer";

function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith("/view/") && !pathname.startsWith(LOGIN_ROUTE);
}

function isLoginRoute(pathname: string): boolean {
  return pathname.startsWith(LOGIN_ROUTE);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  // Lee el JWT desde la cookie (sin llamada de red — decodificación local).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getSession() decodifica el JWT desde la cookie localmente — sin red, sin DB.
  // La validación real contra Supabase ocurre en cada API route (getUser).
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthed = !!session?.user;

  if (!isAuthed && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
  }

  if (isAuthed && isLoginRoute(pathname)) {
    return NextResponse.redirect(new URL(AFTER_AUTH_ROUTE, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$).*)"],
};
