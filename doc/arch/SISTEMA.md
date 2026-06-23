# SISTEMA — Old World Builder

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | React (Create React App) | 17 |
| Estado global | Redux Toolkit + React-Redux | 1.7 / 7.2 |
| Ruteo | react-router-dom | 5 |
| Internacionalización | react-intl | 6 |
| Drag & drop | react-beautiful-dnd | 13 |
| PWA | Workbox (precaching, routing, strategies) | 5 |
| Testing | Jest + React Testing Library | — |
| Error tracking | Sentry (@sentry/react) | 7 |
| Linting | ESLint (config react-app) | 7 |
| Formato | Prettier | 2 |
| Build y deploy | react-scripts 5 + gh-pages | — |
| Gestor de paquetes | Yarn | 2 |

## Arquitectura

**SPA (Single Page Application)** — sin backend. Todo client-side con almacenamiento en `localStorage`.

| Componente | Descripción |
|---|---|
| `src/App.js` | Ruteo principal (Switch x react-router-dom) con layout responsive (mobile/desktop) |
| `src/store.js` | Configuración del store Redux |
| `src/state/` | Slices Redux: army, errors, items, lists, rules-index, settings |
| `src/pages/` | 20 páginas (editor, unidades, magia, datasets, etc.) |
| `src/components/` | Componentes reutilizables (Header, Main, etc.) |
| `src/i18n/` | Traducciones multi-idioma via react-intl |
| `src/assets/` | Recursos estáticos (iconos game-icons.net CC BY 3.0) |
| `public/` | Assets públicos, PWA manifest, service worker |

## Flujo de datos

```
Usuario → React Router → Página → Redux Action → Reducer → Store → React re-render
                              ↕
                         localStorage (persistencia)
```

## Datasets

Los ejércitos se definen en JSON almacenados en `public/datasets/`. La comunidad contribuye datos y traducciones vía Discord. Documentación del formato en `docs/datasets.md`.

## Despliegue

- **Host:** GitHub Pages via gh-pages
- **Comando:** `npm run deploy` (build → gh-pages -d build)
- **URL:** https://old-world-builder.com
- **Sentry:** Sourcemaps injectados post-build para error tracking
