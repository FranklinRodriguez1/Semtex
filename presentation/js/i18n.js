/* Diccionario ES/EN para el sitio de presentación de Semtex.
   Los elementos con [data-i18n] reciben textContent; los que además
   tienen [data-i18n-html] reciben innerHTML (para permitir <span> de énfasis). */

const translations = {
  es: {
    'nav.brand': 'SEMTEX',
    'nav.problem': 'Problema',
    'nav.architecture': 'Arquitectura',
    'nav.market': 'Mercado',
    'nav.features': 'Funciones',
    'nav.advantage': 'Ventaja',
    'nav.future': 'Visión',

    'hero.eyebrow': 'Copiloto administrativo y financiero con IA',
    'hero.title': 'De datos dispersos a <span>acción autónoma</span>, sin fricción.',
    'hero.subtitle': 'La brecha entre recolectar datos y ejecutar decisiones es el freno silencioso del crecimiento empresarial. Semtex no solo acorta esa brecha: la elimina, convirtiendo tu información contable en acción instantánea.',
    'hero.cta_primary': 'Ver la arquitectura',
    'hero.cta_secondary': 'Funciones clave',

    'problem.eyebrow': 'El problema',
    'problem.title': 'La fricción silenciosa que frena a las PyMEs en crecimiento',
    'problem.subtitle': 'Piensa en la última vez que una decisión crítica se retrasó porque un reporte no estaba listo o un correo se perdió. Ese pequeño roce es el enemigo real de la operación.',
    'problem.card1.title': 'Reportes que llegan tarde',
    'problem.card1.body': 'Los datos financieros viven dispersos en hojas de cálculo y no llegan a tiempo para decidir.',
    'problem.card2.title': 'Comunicación que se pierde',
    'problem.card2.body': 'Correos corporativos clave se traspapelan entre bandejas de entrada sobrecargadas.',
    'problem.card3.title': 'Crecer sin más nómina',
    'problem.card3.body': 'Escalar operaciones hoy implica contratar más personal administrativo, no más inteligencia.',

    'architecture.eyebrow': 'Arquitectura técnica',
    'architecture.title': 'Un motor de automatización con agentes de IA autónomos',
    'architecture.subtitle': 'El frontend usa Next.js con arquitectura Feature-Driven para una interfaz táctica, escalable y modular. El backend corre en Java, aportando la seguridad de nivel empresarial y la concurrencia optimizada que exige el procesamiento pesado.',
    'architecture.diagram.frontend': 'Frontend\n(Next.js 16)',
    'architecture.diagram.auth': 'Supabase Auth\n(JWT ES256)',
    'architecture.diagram.backend': 'Backend Spring\n(Java, Render)',
    'architecture.diagram.db': 'Postgres\n(Supabase)',
    'architecture.stack1.title': 'Frontend táctico',
    'architecture.stack1.body': 'Next.js + Feature-Driven Design: cada vista encapsula su propio Container, hooks y servicios, aislando cambios entre módulos.',
    'architecture.stack2.title': 'Backend empresarial',
    'architecture.stack2.body': 'Java / Spring Boot como servicio independiente: seguridad de nivel empresarial y concurrencia optimizada para procesamiento pesado.',
    'architecture.stack3.title': 'Multi-tenant y RBAC',
    'architecture.stack3.body': 'Aislamiento estricto de datos por empresa (org_id embebido en el JWT) con roles Administrador y Operador.',
    'architecture.stack4.title': 'Servicios independientes',
    'architecture.stack4.body': 'Frontend y backend escalan por separado: a medida que tu negocio crece, el sistema crece sin puntos únicos de falla.',

    'market.eyebrow': 'Mercado y modelo de negocio',
    'market.title': 'Construido para empresas de alto crecimiento y alto volumen',
    'market.subtitle': 'Semtex sirve a CFOs y gerentes de operaciones que necesitan escalar su impacto sin aumentar la nómina administrativa.',
    'market.item1': 'Empresas de alto crecimiento con volúmenes transaccionales crecientes.',
    'market.item2': 'CFOs que necesitan claridad financiera en tiempo real, no al cierre de mes.',
    'market.item3': 'Gerentes de operaciones que buscan escalar impacto sin escalar headcount.',
    'market.item4': 'Equipos administrativos y financieros de PyMEs que hoy pierden horas en tareas repetitivas.',
    'market.quote': '“Cerramos la brecha entre el potencial técnico y la realidad operativa: las empresas se enfocan en estrategia mientras nuestros agentes gestionan la complejidad del día a día.”',

    'features.eyebrow': 'Funciones clave',
    'features.title': 'De la bandeja de entrada a la hoja de cálculo, todo automatizado',
    'features.subtitle': 'Dos agentes de IA que convierten el trabajo administrativo repetitivo en un activo estratégico.',
    'features.email.title': 'Agente de automatización de correo',
    'features.email.body': 'Elimina la carga manual de clasificar, filtrar y responder. Garantiza comunicación ininterrumpida y libera a tu equipo para enfocarse en estrategia en lugar de gestionar bandejas de entrada.',
    'features.email.item1': 'Redacción y envío automático de correos corporativos.',
    'features.email.item2': 'Orquestación por Function Calling desde el chat.',
    'features.email.item3': 'Configuración SMTP propia por organización.',
    'features.finance.title': 'Análisis financiero impulsado por IA',
    'features.finance.body': 'Semtex toma datos financieros crudos y fragmentados, los normaliza y extrae insights accionables que a un humano le tomarían horas procesar, convirtiendo la incertidumbre en decisiones claras en tiempo real.',
    'features.finance.item1': 'Carga drag-and-drop de Excel (.xlsx/.xls) y CSV.',
    'features.finance.item2': 'Consultas en lenguaje natural sobre balances e ingresos.',
    'features.finance.item3': 'Comparativas financieras temporales al instante.',

    'advantage.eyebrow': 'Ventaja competitiva',
    'advantage.title': 'Semtex entiende y actúa',
    'advantage.subtitle': 'A diferencia de las plataformas tradicionales que funcionan como bodegas estáticas de datos, nuestra ventaja está en integrar ejecución autónoma con observabilidad total del usuario.',
    'advantage.old.title': 'Software tradicional',
    'advantage.old.item1': 'Dashboards estáticos que solo muestran información.',
    'advantage.old.item2': 'La acción final siempre depende de un humano.',
    'advantage.old.item3': 'Poca o ninguna trazabilidad de lo que ocurrió y por qué.',
    'advantage.new.title': 'Semtex',
    'advantage.new.item1': 'Ejecución autónoma de procesos financieros y de comunicación.',
    'advantage.new.item2': 'Observabilidad total: cada acción del agente queda auditada.',
    'advantage.new.item3': 'Confianza total: el usuario ve y controla lo que el agente hace.',

    'future.eyebrow': 'Visión futura y cierre',
    'future.title': 'El sistema nervioso operativo de tu empresa',
    'future.body': 'Estamos integrando sistemas avanzados de auditoría técnica en tiempo real, para que Semtex funcione no solo como un ejecutor confiable, sino como una entidad constante de validación técnica y seguridad. Estamos construyendo el estándar de la industria para la eficiencia operativa.',
    'future.cta': 'Ir a la aplicación',

    'footer.tagline': 'Semtex — Copiloto Administrativo y Financiero con IA.',
    'footer.confidential': 'Documento y proyecto confidenciales, uso interno del equipo Semtex.',
    'footer.contact_label': 'Contacto',
    'footer.rights': '© 2026 Semtex. Todos los derechos reservados.'
  },

  en: {
    'nav.brand': 'SEMTEX',
    'nav.problem': 'Problem',
    'nav.architecture': 'Architecture',
    'nav.market': 'Market',
    'nav.features': 'Features',
    'nav.advantage': 'Advantage',
    'nav.future': 'Vision',

    'hero.eyebrow': 'AI-powered administrative & financial copilot',
    'hero.title': 'From scattered data to <span>autonomous action</span>, with zero friction.',
    'hero.subtitle': 'The gap between collecting data and executing decisions is the silent killer of enterprise growth. Semtex doesn\'t just bridge that gap — it eliminates it, turning your accounting data into instant, autonomous action.',
    'hero.cta_primary': 'See the architecture',
    'hero.cta_secondary': 'Key features',

    'problem.eyebrow': 'The problem',
    'problem.title': 'The silent friction slowing down growing SMBs',
    'problem.subtitle': 'Think about the last time a critical decision was delayed because a report wasn\'t ready or an email was missed. That small friction point is the real enemy of operations.',
    'problem.card1.title': 'Reports that arrive late',
    'problem.card1.body': 'Financial data lives scattered across spreadsheets and never arrives in time to decide.',
    'problem.card2.title': 'Communication that gets lost',
    'problem.card2.body': 'Key corporate emails get buried in overloaded inboxes.',
    'problem.card3.title': 'Growth without more headcount',
    'problem.card3.body': 'Scaling operations today means hiring more administrative staff, not more intelligence.',

    'architecture.eyebrow': 'Technical architecture',
    'architecture.title': 'An automation engine powered by autonomous AI agents',
    'architecture.subtitle': 'The frontend uses Next.js with a Feature-Driven architecture for a tactical, scalable, modular interface. The backend runs on Java, providing the enterprise-grade security and optimized concurrency heavy processing requires.',
    'architecture.diagram.frontend': 'Frontend\n(Next.js 16)',
    'architecture.diagram.auth': 'Supabase Auth\n(JWT ES256)',
    'architecture.diagram.backend': 'Spring Backend\n(Java, Render)',
    'architecture.diagram.db': 'Postgres\n(Supabase)',
    'architecture.stack1.title': 'Tactical frontend',
    'architecture.stack1.body': 'Next.js + Feature-Driven Design: each view encapsulates its own Container, hooks and services, isolating changes between modules.',
    'architecture.stack2.title': 'Enterprise-grade backend',
    'architecture.stack2.body': 'Java / Spring Boot as an independent service: enterprise-grade security and optimized concurrency for heavy processing.',
    'architecture.stack3.title': 'Multi-tenant & RBAC',
    'architecture.stack3.body': 'Strict per-company data isolation (org_id embedded in the JWT) with Admin and Operator roles.',
    'architecture.stack4.title': 'Independent services',
    'architecture.stack4.body': 'Frontend and backend scale separately: as your business grows, the system scales with no single point of failure.',

    'market.eyebrow': 'Market & business impact',
    'market.title': 'Built for high-growth, high-volume companies',
    'market.subtitle': 'Semtex serves CFOs and operations managers who need to scale their impact without scaling administrative headcount.',
    'market.item1': 'High-growth companies handling increasing transaction volumes.',
    'market.item2': 'CFOs who need real-time financial clarity, not month-end clarity.',
    'market.item3': 'Operations managers looking to scale impact without scaling headcount.',
    'market.item4': 'SMB admin and finance teams currently losing hours to repetitive tasks.',
    'market.quote': '“We bridge the gap between technical potential and operational reality: companies focus on strategy while our agents manage the complexity of daily operations.”',

    'features.eyebrow': 'Key features',
    'features.title': 'From the inbox to the spreadsheet, fully automated',
    'features.subtitle': 'Two AI agents that turn repetitive administrative work into a strategic asset.',
    'features.email.title': 'Email automation agent',
    'features.email.body': 'Eliminates the manual burden of sorting, filtering and responding. Ensures uninterrupted communication and frees your team to focus on strategy instead of inbox management.',
    'features.email.item1': 'Automatic drafting and sending of corporate emails.',
    'features.email.item2': 'Function Calling orchestration straight from the chat.',
    'features.email.item3': 'Self-service SMTP configuration per organization.',
    'features.finance.title': 'AI-driven financial analysis',
    'features.finance.body': 'Semtex takes raw, fragmented financial data, normalizes it, and extracts actionable insights that would normally take a human hours to process — turning uncertainty into real-time, data-driven decisions.',
    'features.finance.item1': 'Drag-and-drop upload of Excel (.xlsx/.xls) and CSV files.',
    'features.finance.item2': 'Natural-language queries about balances and income.',
    'features.finance.item3': 'Instant time-based financial comparisons.',

    'advantage.eyebrow': 'Competitive advantage',
    'advantage.title': 'Semtex understands and acts',
    'advantage.subtitle': 'Unlike traditional platforms that act as static data warehouses, our advantage lies in integrating autonomous execution with total user observability.',
    'advantage.old.title': 'Traditional software',
    'advantage.old.item1': 'Static dashboards that only display information.',
    'advantage.old.item2': 'The final action always depends on a human.',
    'advantage.old.item3': 'Little to no traceability of what happened and why.',
    'advantage.new.title': 'Semtex',
    'advantage.new.item1': 'Autonomous execution of financial and communication processes.',
    'advantage.new.item2': 'Total observability: every agent action is logged and auditable.',
    'advantage.new.item3': 'Complete trust: the user sees and controls what the agent does.',

    'future.eyebrow': 'Future vision & closing',
    'future.title': 'The operational nervous system your company needs',
    'future.body': 'We are integrating advanced real-time technical audit systems, so Semtex functions not just as a reliable executor, but as a constant entity of technical validation and security. We are building the industry standard for operational efficiency.',
    'future.cta': 'Go to the app',

    'footer.tagline': 'Semtex — AI Administrative & Financial Copilot.',
    'footer.confidential': 'Confidential document and project, for internal Semtex team use.',
    'footer.contact_label': 'Contact',
    'footer.rights': '© 2026 Semtex. All rights reserved.'
  }
};

const STORAGE_KEY = 'semtex-pitch-lang';

function applyLanguage(lang) {
  const dict = translations[lang] || translations.es;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key];
    if (value === undefined) return;

    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const [attr, key] = el.getAttribute('data-i18n-attr').split(':');
    const value = dict[key];
    if (value !== undefined) el.setAttribute(attr, value);
  });

  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });

  localStorage.setItem(STORAGE_KEY, lang);
}

function setLanguage(lang) {
  applyLanguage(lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const browserLang = navigator.language && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
  applyLanguage(saved || browserLang);

  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
});
