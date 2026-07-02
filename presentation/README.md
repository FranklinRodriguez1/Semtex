# Semtex — Sitio de presentación (pitch)

Página estática (HTML + CSS + JS puro, sin frameworks ni paso de build) para exponer
la visión, arquitectura y funciones clave de Semtex, alineada con el guion del pitch
y el contenido de `README.md` / `semtex.txt` en la raíz del repo.

Es completamente independiente de la app Next.js (`src/`, `public/`): no se ejecuta
con `bun run dev`, no depende de `package.json` y puede abrirse o desplegarse por
separado (por ejemplo, como GitHub Pages, Netlify o un simple `index.html` compartido
antes de la presentación).

## Cómo verla

**Opción 1 — abrir directo:**
Doble clic en `index.html` (o arrástralo a una pestaña del navegador).

**Opción 2 — servidor local (recomendado para probar rutas/recargas):**
```bash
cd presentation
python3 -m http.server 8000
```
Luego abre [http://localhost:8000](http://localhost:8000).

## Estructura

```
presentation/
├── index.html      # secciones: hero, problema, arquitectura, mercado, funciones, ventaja, visión/cierre
├── css/styles.css  # paleta "Critical State" de Semtex + layout + animaciones
├── js/i18n.js      # diccionario ES/EN y toggle de idioma (persistido en localStorage)
├── js/main.js      # scroll-spy, scroll-reveal, smooth scroll, menú móvil
└── assets/         # logo e iconos reutilizados del proyecto principal
```

## Idioma

El selector ES/EN en la barra de navegación cambia todo el texto de la página
(`data-i18n` en `index.html` + diccionario en `js/i18n.js`) y recuerda la preferencia
del usuario entre visitas.
