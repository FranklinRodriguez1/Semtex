# Semtex - Documento funcional del producto

## 1. Vision general

Semtex es una aplicacion tactica para operar una experiencia de autenticacion, acceso por roles y gestion interna de módulos corporativos.

La app debe:

- autenticar usuarios con Supabase
- mantener la sesion activa en el navegador
- redirigir usuarios no autenticados al login
- exponer vistas protegidas solo cuando hay sesion valida
- mostrar informacion basica del usuario actual
- separar la logica por modulo en `services`

## 2. Comportamiento esperado de toda la app

### 2.1 Autenticacion

- El usuario inicia sesion o se registra en `/view/loginy`.
- La app obtiene un access token JWT desde Supabase.
- Ese token se usa para validar requests internas.
- Si no hay sesion, no se debe permitir el acceso a vistas privadas.

### 2.2 Redireccion

- Si el usuario no esta autenticado y entra a una ruta privada, debe volver a `/view/loginy`.
- Si ya esta autenticado y entra al login, debe ser llevado a `/view/transfer`.

### 2.3 Contexto global

- La app debe guardar en un contexto global:
  - `id`
  - `name`
  - `email`
  - `status`
  - `isAuthenticated`
- Ese contexto se usa para mostrar el usuario y tomar decisiones de navegacion.

### 2.4 Rutas protegidas

Las rutas privadas actuales son:

- `/view/transfer`
- `/view/configuration`
- `/view/team`
- `/view/admin`

La ruta publica principal de autenticacion es:

- `/view/loginy`

La ruta publica de entrada es:

- `/`

## 3. Funciones por modulo

### 3.1 Home

La vista principal:

- muestra una esfera/escena visual con Three.js
- contiene una barra de comando
- usa iconos desde `public`
- es una pantalla de entrada visual

### 3.2 Loginy

La vista de login:

- permite registrar o iniciar sesion
- usa Supabase Auth
- redirige al usuario despues de autenticar
- persiste la sesion para futuras visitas

### 3.3 Transfer

Debe permitir:

- enviar informacion o archivos
- cambiar entre modo enviar y recibir
- mostrar acciones tacticas de transferencia

### 3.4 Configuration

Debe permitir:

- ver integraciones
- revisar roles
- alternar entre modos de configuracion

### 3.5 Team

Debe permitir:

- ver usuarios de la empresa
- invitar empleados
- mostrar rol y estado de cada usuario

### 3.6 Admin

Debe permitir:

- crear una empresa nueva
- crear el usuario admin inicial de esa empresa
- usar una capa de servicios exclusiva del modulo

## 4. Reglas de seguridad

- El cliente solo debe mostrar UI.
- La decision real de acceso debe depender de la sesion valida.
- Las rutas API deben validar Bearer token.
- Los modulos sensibles deben validar permisos en servidor.

## 5. Servicios del proyecto

Cada modulo debe tener su capa de servicios cuando tenga logica propia.

Servicios actuales:

- `src/app/view/admin/services/admin.ts`
- `src/app/view/configuration/services/configuration.ts`
- `src/app/view/transfer/services/transfer.ts`
- `src/app/view/loginy/services` para logica del login
- `src/app/view/team/services` para logica de usuarios

## 6. Infraestructura

### 6.1 Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### 6.2 Backend y auth

- Supabase Auth para login y JWT
- Supabase Admin solo en servidor
- backend externo consumido con `NEXT_PUBLIC_API_URL`

## 7. Variables de entorno

Archivo:

- `.env`

Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPERADMIN_EMAILS`

## 8. Flujo esperado del sistema

1. El usuario abre la app.
2. Si no esta autenticado, va a login.
3. Se autentica.
4. La app valida la sesion y guarda datos basicos en contexto.
5. El usuario entra a las vistas protegidas.
6. Cada modulo usa su servicio para ejecutar la logica que le corresponde.
7. Si cierra sesion, vuelve al login.

## 9. Criterios de implementacion

- No mezclar logica de negocio con componentes visuales.
- No crear archivos extra si el modulo ya tiene carpeta de servicios.
- Reutilizar el JWT de Supabase para requests internas.
- Mantener la separacion por modulo.
- Mantener la proteccion de rutas y no solo esconder componentes.
