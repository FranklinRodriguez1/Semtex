# Semtex · Guía de integración Front ↔ Backend

Cómo está cableada la app hoy: autenticación, rutas del backend, rutas internas de
Next y cómo llamar a todo. Léelo antes de tocar el código de datos/login.

## Arquitectura en 1 minuto

```
┌────────────┐  1. login/register   ┌─────────────────┐
│  FRONTEND  │ ───────────────────► │  SUPABASE AUTH  │  (emite el JWT)
│  (Next 16) │ ◄─────────────────── │                 │
│            │     access_token     └─────────────────┘
│            │
│            │  2. Bearer <token>   ┌─────────────────┐  3. JDBC
│            │ ───────────────────► │  BACKEND Spring │ ───────► Supabase Postgres
└────────────┘   datos de negocio   │  (:8080 /api)   │          (mismas tablas)
                                     └─────────────────┘
```

- **Supabase Auth** maneja usuarios/contraseñas y **emite el JWT**.
- El **backend NO hace login**: es un *resource server* que **valida** el JWT (firma
  ES256 vía JWKS de Supabase) y aplica permisos + aislamiento multi-tenant.
- El JWT lleva claims inyectados por un *Access Token Hook* de Supabase:
  - `sub` = id de usuario · `email`
  - `org_id` = organización (tenant) · `app_role` = `ADMIN | OPERATOR | AUDITOR`

## Estado actual (qué funciona)

| Pieza | Estado |
|---|---|
| Login / logout (Supabase) | ✅ |
| Backend valida el JWT real de Supabase (JWKS/ES256) | ✅ |
| Provisión automática (trigger crea org + usuario) | ✅ |
| Multi-tenant (cada empresa ve solo lo suyo) | ✅ |
| Super-admin crea empresas (`/view/admin`) | ✅ (requiere `service_role`) |
| Admin invita empleados (`/view/team`) | ✅ (requiere `service_role`) |
| Subir documentos (`/view/transfer` → `POST /api/documents`) | ✅ cableado — requiere fix de Render (ver abajo) |
| Chat IA (`/api/chat/messages`) | ✅ cableado — requiere fix de Render (ver abajo) |

## ⚠️ Fix crítico en Render — claim de rol (chat y documentos dan 403)

El Access Token Hook de Supabase inyecta el rol en el JWT como `app_role`.
El backend en Render por defecto busca el claim `role`. Eso produce un `ROLE_`
authority vacío → `hasRole("ADMIN")` falla → **403 en todos los endpoints protegidos**.

**Acción requerida (una sola variable de entorno en Render):**

```
semtex.jwt.role-claim=app_role
```

Ruta: Render dashboard → servicio `semtex-backend` → **Environment** → Add env var → redeploy.

> Alternativamente, si se actualiza el hook de Supabase para inyectar el claim como `role`
> (en lugar de `app_role`), no hace falta tocar Render.

**Modelo de onboarding (cerrado):** no hay registro público. El **super-admin** de la
plataforma crea cada empresa + su admin; el **admin** invita a sus empleados.

## Setup local

1. Variables en `.env` (en la raíz del front). Pide las claves al líder del repo:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cwubsogxbiuxyjihghag.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key — pública, pídela al líder>

# Backend YA DESPLEGADO en Render — úsalo tal cual:
NEXT_PUBLIC_API_URL=https://semtex-backend.onrender.com

# SOLO SERVIDOR (sin NEXT_PUBLIC). Secreta, NO subir a git:
SUPABASE_SERVICE_ROLE_KEY=<service_role — secreta, pídela al líder>
SUPERADMIN_EMAILS=correo1@x.com,correo2@x.com
```

> **Backend desplegado:** `https://semtex-backend.onrender.com`
> · Swagger: `/swagger-ui/index.html` · Health: `/actuator/health`
> Está en plan Free de Render: la **primera** petición tras un rato de inactividad
> tarda ~50s (cold start); luego va normal.
>
> **CORS:** el backend solo acepta orígenes listados en Render
> (`SEMTEX_CORS_ALLOWED_ORIGINS`). Hoy: `http://localhost:3000`. Si tu front corre en
> **otro puerto** o lo despliegas (Vercel), hay que **agregar ese origen** en las variables
> de entorno de Render, o el navegador bloqueará las llamadas.

2. Instalar y correr:

```bash
bun install
bun run dev          # http://localhost:3000
```

3. El backend debe estar corriendo (local en `:8080` o desplegado). Si es local, ver el
   README del repo `semtex-application-backend`.

## Cómo llamar a las cosas (helpers)

Todo está en `src/lib/`:

- **`api.ts` → `apiFetch(path, init?)`** — llama al **backend Spring** (`NEXT_PUBLIC_API_URL`)
  adjuntando el `Bearer` automáticamente. Úsalo para todo lo de `/api/**` del backend.

  ```ts
  import { apiFetch } from "@/lib/api";
  const orgs = await apiFetch("/api/organizations");      // GET
  const doc  = await apiFetch("/api/documents", { method: "POST", body: formData });
  ```

- **`session.ts`** — sesión y rutas internas de Next:
  - `getClaims()` → claims del JWT actual (`org_id`, `app_role`, `email`).
  - `getInternal(path)` / `postInternal(path, body)` → llaman a rutas `/api/*` **de Next**
    (las nuestras, server-side) con el Bearer.

- **`supabase.ts`** — cliente de Supabase del navegador (`signInWithPassword`, `signOut`, etc.).
- **`supabaseAdmin.ts`** — ⚠️ SOLO servidor (usa `service_role`). No importar en componentes `"use client"`.

## Rutas internas de Next (las construimos nosotros, server-side)

Necesitan `Bearer` del usuario. Validan identidad con la `service_role`.

| Método | Ruta | Quién | Qué hace |
|---|---|---|---|
| GET | `/api/me` | autenticado | Devuelve `{ email, role, organizationId, isSuperAdmin }` |
| POST | `/api/admin/companies` | super-admin | Crea empresa + su ADMIN. Body `{ companyName, adminEmail, adminPassword }` |
| POST | `/api/team/invite` | ADMIN | Crea empleado en SU org. Body `{ email, password, role }` |

## Rutas del backend Spring (`http://<backend>/api/**`)

Todas privadas (requieren `Bearer`). El tenant sale del token; **no** se envía `organizationId`.
Contrato completo: `semtex-application-backend/docs/API_CONTRACT.md`.

| Método | Ruta | Rol mínimo |
|---|---|---|
| GET/POST/PATCH/DELETE | `/api/organizations` | GET autenticado · resto ADMIN |
| GET/POST | `/api/users` · PATCH `/{id}/role` · DELETE `/{id}` | GET autenticado · resto ADMIN |
| POST/GET/DELETE | `/api/documents` | subir: ADMIN/OPERATOR · borrar: ADMIN |
| GET | `/api/financial-records?documentId=&limit=` | autenticado |
| POST/GET | `/api/chat/messages` | ADMIN/OPERATOR |
| GET | `/api/audit/logs?limit=` | ADMIN/AUDITOR |

Formato de error uniforme: `{ timestamp, status, error, message, path, fieldErrors? }`.
`apiFetch` ya extrae `message` y lo lanza como `Error`.

## Multi-tenant (importante)

Cada usuario carga su `org_id` en el token. El backend filtra **toda** consulta por ese
`org_id`. Un usuario nunca ve datos de otra empresa, y no hace falta filtrar en el front.

## Envío de correos (backend agent)

El correo se delega al agente LangChain4j del backend mediante la herramienta
`enviarCorreo`. El front le pasa al agente un prompt del estilo:

> "Envía un correo electrónico a destinatario@ejemplo.com con asunto '...' y el siguiente mensaje: ..."

El agente invoca `SemtexAgentTools.enviarCorreo` usando `spring.mail.*`.

**Variables requeridas en Render para el envío de correos:**

```
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=tu-cuenta@gmail.com
SPRING_MAIL_PASSWORD=<contraseña de aplicación de Gmail>
SEMTEX_EMAIL_FROM=tu-cuenta@gmail.com
```

> `SPRING_MAIL_PASSWORD` debe ser una **contraseña de aplicación** (no la contraseña
> de la cuenta). Generarla en Gmail → Seguridad → Verificación en 2 pasos → Contraseñas de apps.

No hay configuración SMTP en el frontend. La UI de Configuración muestra solo información.

## Pendiente / por hacer

- ✅ Subida de documentos y tabla de `financial-records` — cableado.
- ✅ Chat IA (`/api/chat/messages`) — cableado.
- ✅ Auditoría (`/api/audit/logs`) — cableado.

## ⚠️ Fix de CORS — agregar dominio de Vercel

El backend en Render solo permite orígenes listados en `SEMTEX_CORS_ALLOWED_ORIGINS`.
Sin esto, el navegador bloqueará todas las llamadas desde Vercel.

**Acción requerida en Render** (misma sección de Environment):

```
SEMTEX_CORS_ALLOWED_ORIGINS=http://localhost:3000,https://TU-APP.vercel.app
```

Reemplaza `TU-APP.vercel.app` con el dominio real de Vercel. Si usas dominio propio,
agrégalo también separado por coma.

## Despliegue

- **Backend:** ✅ desplegado en Render → `https://semtex-backend.onrender.com`
  (Docker + perfil `prod`). Guía y variables: `semtex-application-backend/DEPLOY.md`.
- **Front:** desplegar en **Vercel** (Next.js). Pasos:
  1. Configura las mismas variables de `.env` en el panel de Vercel.
  2. Agrega el dominio de Vercel a `SEMTEX_CORS_ALLOWED_ORIGINS` en Render (ver arriba).
  3. Agrega `semtex.jwt.role-claim=app_role` en Render (ver arriba).
- La base de datos ya es Supabase (en la nube). **Login funciona sin MinIO ni Ollama**
  (Ollama solo hace falta para el chat IA).
