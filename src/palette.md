# Paleta de colores — Semtex `Critical State`

Este archivo documenta la paleta usada en el diseño de la vista `loginy` según el HTML y el Tailwind config que compartiste.

## Colores base

- `obsidian-dark`: `#0F172A`
  - Fondo general de la interfaz.
- `surface`: `#131315`
  - Paneles oscuros y contenedores principales.
- `surface-container`: `#201F21`
  - Fondo interno de tarjetas y formularios.
- `surface-container-lowest`: `#0E0E10`
  - Barras y separadores más oscuros.
- `surface-container-high`: `#2A2A2C`
  - Exteriores y secciones ligeramente elevadas.
- `surface-bright`: `#39393B`
  - Destellos y bordes suaves en elementos brillantes.

## Colores de acento

- `obsidian-cian`: `#06B6D4`
  - Estado activo, botones principales y marcas cyan.
- `obsidian-orange`: `#F97316`
  - Estado alternativo, modo login / boom, y activos naranja.
- `primary`: `#E1FDFF`
  - Texto destacado y títulos sobre superficies oscuras.
- `primary-container`: `#00F2FF`
  - Destacado de fondo en botones y controles.
- `primary-fixed`: `#74F5FF`
  - Versión más brillante del cyan para efectos.
- `primary-fixed-dim`: `#00DBE7`
  - Glow y sombras cyan suaves.

## Colores de texto

- `on-surface`: `#E5E1E4`
  - Texto principal sobre fondos oscuros.
- `on-surface-variant`: `#B9CACB`
  - Labels y texto secundario.
- `on-secondary`: `#003907`
  - Texto sobre fondos secundarios claros.
- `on-background`: `#E5E1E4`
  - Texto general del layout.

## Colores de estado

- `secondary`: `#ECFFE3`
  - Elementos de estado secundarios claros.
- `secondary-fixed`: `#72FF70`
  - Indicadores auxiliares.
- `error`: `#FFB4AB`
  - Advertencias y errores.
- `error-container`: `#93000A`
  - Fondo de notificaciones de error.

## Bordes y separadores

- `outline`: `#849495`
  - Líneas y bordes generales.
- `outline-variant`: `#3A494B`
  - Bordes de secciones y contenedores.
- `surface-tint`: `#00DBE7`
  - Resalte tenue en bordes y sombras.

## Uso recomendado

1. **Fondo principal:** `obsidian-dark`
2. **Paneles y tarjetas:** `surface`, `surface-container`, `surface-container-lowest`
3. **Accentos de estado:** `obsidian-cian` y `obsidian-orange`
4. **Texto:** `on-surface` y `on-surface-variant`
5. **Botones/indicadores activos:** `primary`, `primary-container`, `primary-fixed`
6. **Efectos de glow:** `primary-fixed-dim`

## Notas de diseño

- El look debe ser oscuro, técnico y minimalista.
- El toggle usa cyan para el modo `REGISTER/ARMED` y naranja para el modo `LOGIN/BOOM`.
- El formulario principal debe tener inputs negros con bordes cyan/orange según el modo activo.
- El contraste entre `obsidian-dark` y `surface-container` es clave para el efecto "panel flotante".
