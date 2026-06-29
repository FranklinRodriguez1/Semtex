# Semtex - Documento de Especificaciones Técnicas y de Producto (MVP)

---

## 1. Propósito y Objetivos
* **Propósito:** Crear un SaaS de automatización inteligente (Copiloto Administrativo y Financiero) que permita a las PyMEs semi-automatizar tareas repetitivas de análisis de datos y comunicación mediante lenguaje natural, garantizando privacidad absoluta de sus datos[cite: 2, 3].
* **Objetivo General:** Desarrollar un agente autónomo de IA capaz de interpretar archivos estructurados (Excel) y ejecutar acciones en el entorno real (envío de correos) bajo una arquitectura multi-inquilino segura[cite: 2, 3].
* **Objetivos Técnicos:** 
  * Procesar y estructurar datos dinámicos de hojas de cálculo sin perder consistencia relacional[cite: 2, 3].
  * Implementar *Function Calling* para orquestar servicios externos desde un chat de IA[cite: 2, 3].
  * Validar el uso de modelos de lenguaje de código abierto locales para asegurar la confidencialidad de la información[cite: 2, 3].

---

## 2. ¿Qué hace la app? (Funciones del MVP)
* **Ingesta:** Carga y lectura de archivos Excel (`.xlsx`, `.xls`) y `.csv` mediante interfaz drag-and-drop[cite: 2, 3].
* **Análisis:** Consultas en lenguaje natural sobre balances, ingresos, egresos y comparativas financieras temporales[cite: 2, 3].
* **Automatización:** Redacción y envío automático de correos corporativos utilizando APIs externas (Resend / Gmail API)[cite: 2, 3].
* **Agente IA:** Orquestación mediante *Function Calling* para extraer parámetros del chat y ejecutar acciones autónomamente[cite: 2, 3].
* **Seguridad SaaS:** Aislamiento multi-inquilino estricto por empresa con control de acceso basado en roles (Admin, Operador, Auditor)[cite: 2, 3].
* **Auditoría:** Registro histórico persistente de conversaciones y logs de las acciones tomadas por el agente[cite: 2, 3].

---

## 3. ¿Qué recibe la app? (Inputs del Sistema)
* **Archivos de Datos:** Documentos contables y financieros físicos subidos por el usuario[cite: 2, 3].
* **Prompts de Usuario:** Mensajes e instrucciones de texto ingresados en la interfaz de chat (ej. *"¿Cuál es la ganancia de mayo?"*)[cite: 2, 3].
* **Contexto de Sesión:** Metadatos de autenticación del usuario (`user_id`) y de su empresa (`organization_id`) vía tokens JWT[cite: 2, 3].
* **Credenciales de Integración:** API Keys o tokens OAuth configurados para servicios externos de mensajería[cite: 2, 3].

---

## 4. Arquitectura y Estrategia de Base de Datos
* **Stack Tecnológico:** Next.js (App Router, TypeScript), Tailwind CSS (UI táctica/modo oscuro), Supabase y Prisma ORM[cite: 2, 3].
* **Enfoque de Base de Datos:** **Relacional (PostgreSQL)** para asegurar precisión matemática absoluta (Consistencia ACID) y aislamiento nativo por empresa mediante Políticas de Seguridad a Nivel de Fila (**RLS**)[cite: 2, 3].
* **Flexibilidad de Datos:** Se implementa el tipo **`JSONB`** en la tabla de registros financieros para almacenar las celdas y filas de los Excels dinámicos sin romper la estructura rígida de la base de datos core[cite: 2, 3].
* **Entidades Prisma Core:** `Organization`, `User` (con roles RBAC), `Document` (metadatos del storage), `FinancialRecord` (contenido JSONB) y `ChatMessage`[cite: 2, 3].

---

## 5. Autenticación y Control de Accesos (RBAC)
* **Autenticación:** Delegada en **Supabase Auth** con tokens JWT validados en API Routes[cite: 2, 3].
* **Validación de Roles:**
  * **Administrador (Admin):** Control total de usuarios, APIs de correo, eliminación de archivos y lectura/escritura general[cite: 2, 3].
  * **Operador (Auxiliar):** Carga de Excels, consultas al chat con Semtex y ordenamiento de envío de correos[cite: 2, 3].
  * **Auditor (Invitado):** Solo lectura de reportes históricos y analíticas; sin permisos de carga o acción[cite: 2, 3].

---

## 6. Viabilidad de IA Local (Ollama)
* **Estrategia Técnica:** Conectar las API Routes de Next.js al endpoint local de **Ollama** (`http://localhost:11434`) montado en el servidor o VPS de la aplicación[cite: 2, 3].
* **Modelos Recomendados:** **Llama 3 (8B / 8B.1)** o **Phi-3 (Medium/Mini)** por su alto rendimiento en español, lógica estructurada y soporte nativo para *Function Calling*[cite: 2, 3].
* **Evaluación de Viabilidad:** **Altamente viable.** Elimina costos variables por tokens y ofrece el mayor nivel de privacidad del mercado al no enviar datos financieros fuera de la infraestructura local, requiriendo únicamente un hardware con GPU dedicada para la inferencia[cite: 2, 3].