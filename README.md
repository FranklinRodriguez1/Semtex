# Semtex Core

Semtex es una aplicacion web interna construida con Next.js 16, Supabase y TypeScript para operar un flujo tactico de gestion, autenticacion y acceso por roles.

## Que hace la app

- Permite iniciar sesion y registrar usuarios con Supabase Auth.
- Persiste la sesion en el navegador y reutiliza el JWT para llamadas internas.
- Protege las vistas privadas y redirige al login cuando no hay sesion valida.
- Expone vistas para:
  - `Home` en `/`
  - `Loginy` en `/view/loginy`
  - `Transfer` en `/view/transfer`
  - `Configuration` en `/view/configuration`
  - `Team` en `/view/team`
  - `Admin` en `/view/admin`
- Muestra el usuario actual en la barra lateral y su rol cuando aplica.
- Usa rutas API internas para validar acceso y realizar operaciones privilegiadas.

## Flujo principal

1. El usuario entra a `/view/loginy`.
2. Inicia sesion o se registra con Supabase.
3. La app guarda la sesion y obtiene el JWT activo.
4. El provider global valida si hay usuario autenticado.
5. Si no hay sesion, la app redirige a `/view/loginy`.
6. Si hay sesion, permite navegar por las vistas protegidas.

## Arquitectura actual

- `src/app/layout.tsx`: envuelve toda la app con el provider de autenticacion y el shell visual.
- `src/components/auth/AuthProvider.tsx`: valida la sesion y expone `user`, `status` e `isAuthenticated`.
- `src/components/layout/Shell.tsx`: decide si mostrar el sidebar o bloquear acceso.
- `src/components/layout/Sidebar.tsx`: navega entre vistas y permite cerrar sesion.
- `src/lib/supabase.ts`: cliente de Supabase para navegador.
- `src/lib/supabaseAdmin.ts`: cliente de servidor con `service_role`.
- `src/lib/session.ts`: helper para obtener el access token y hacer requests internas.
- `src/lib/api.ts`: helper para llamar al backend externo con Bearer token.

## Servicios por vista

- `src/app/view/admin/services/admin.ts`: crea empresas y usuarios admin.
- `src/app/view/configuration/services/configuration.ts`: maneja configuracion mockeada y toggles.
- `src/app/view/transfer/services/transfer.ts`: maneja la logica de carga y envio de archivos.
- `src/app/view/team/services`: reservado para la logica del modulo de usuarios.

## Seguridad y acceso

- La autenticacion depende de Supabase Auth.
- El JWT activo se usa para autorizar llamadas a `/api/...`.
- Las rutas de administracion validan rol y privilegios en servidor.
- `super-admin` se resuelve por la lista `SUPERADMIN_EMAILS` en `.env`.

## Variables de entorno

Archivo requerido en la raiz del proyecto:

- `.env`

Variables esperadas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPERADMIN_EMAILS`

## Ejecutar en local

```bash
npm run dev
```

Luego abre:

```bash
http://localhost:3000
```

## Notas

- Si cambias `.env`, reinicia el servidor de desarrollo.
- La carpeta `public` contiene los iconos visuales usados en el home.
- `lint` ya esta configurado con ESLint.
