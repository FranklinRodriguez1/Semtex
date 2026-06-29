# SEMTEX — PROJECT AUDIT

## Estructura

```
src/
├── app/
│   ├── layout.tsx                   Root layout (Shell wrapper)
│   ├── page.tsx                     Redirige a /view/loginy
│   ├── api/
│   │   ├── me/route.ts              GET  /api/me       → sesión actual
│   │   ├── team/invite/route.ts     POST /api/team/invite
│   │   └── admin/companies/route.ts POST /api/admin/companies (super-admin)
│   └── view/
│       ├── loginy/page.tsx          Login + Register (Loginy.tsx)
│       ├── transfer/page.tsx        Subir/Recibir documentos
│       ├── team/page.tsx            Gestión de usuarios ADMIN
│       ├── configuration/page.tsx   Integraciones y roles
│       └── admin/page.tsx           Provisioning super-admin
├── components/
│   ├── layout/
│   │   ├── Shell.tsx                Oculta Sidebar en /view/loginy
│   │   └── Sidebar.tsx              ⛔ ROTO — ver abajo
│   └── home/
│       ├── HomeComponents.tsx       Componente visual (Three.js + input)
│       └── animationHomeThree.ts    Inicializa escena Three.js
└── lib/
    ├── api.ts                       apiFetch() → Spring backend
    ├── session.ts                   getClaims / getInternal / postInternal
    ├── supabase.ts                  Cliente browser
    └── supabaseAdmin.ts             ⚠ Server-only (service_role)
```

---

## Errores críticos

### 1. `src/components/layout/Sidebar.tsx` — ARCHIVO ROTO (no compila)

El archivo contiene **dos implementaciones distintas de `Sidebar` concatenadas** sin que ninguna cierre correctamente.

- Línea 1–28: Primera versión (con `useState`, `useRouter`, `me`, `handleLogout`)
- Línea 29: `'use client'` y `import` **dentro del cuerpo de una función** — sintaxis inválida
- Línea 33: Segunda `export function Sidebar()` **anidada** dentro de la primera
- Línea 45: `<a>` abierto (Terminal) sin cerrar
- Línea 80: `<a>` abierto (Audit) sin cerrar
- Línea 106: `handleLogout` y `me` usados en la segunda función pero no están en su scope

**Acción requerida:** reemplazar el archivo con una única implementación limpia.

---

### 2. `src/app/page.tsx` — Código muerto

```tsx
export default function Home() {
  redirect("/view/loginy");   // ← siempre redirige aquí

  function RootPage() {       // ← nunca se ejecuta
    return <HomeComponents />;
  }
}
```

El import de `HomeComponents` y la función `RootPage` son código muerto. El `redirect()` es incondicional y no hay lógica de autenticación previa.

---

## Botones muertos (sin onClick)

| Archivo | Botón | Línea |
|---|---|---|
| `src/components/home/HomeComponents.tsx` | `mic` | 71 |
| `src/components/home/HomeComponents.tsx` | `attach_file` | 77 |

Ambos botones en el input bar no tienen handler.

---

## Links rotos (rutas inexistentes)

| Href en Sidebar | Página existente |
|---|---|
| `/terminal` | ✗ No existe |
| `/audit` | ✗ No existe |
| `/settings` | ✗ No existe |

---

## Links duplicados (en Sidebar)

Producto de la concatenación de las dos versiones:

| Link | Aparece en líneas |
|---|---|
| `/terminal` | 45 y 48–57 |
| `/audit` | 80 y 82–91 |

---

## Rutas válidas

| URL | Componente |
|---|---|
| `/view/loginy` | Login / Register |
| `/view/transfer` | Upload / Receive |
| `/view/team` | Equipo (ADMIN invite) |
| `/view/configuration` | Configuración |
| `/view/admin` | Super-admin provisioning |

---

## Advertencia de seguridad

`src/lib/supabaseAdmin.ts` usa `service_role`. **No importar en componentes `"use client"`**. Solo para API routes del servidor.
