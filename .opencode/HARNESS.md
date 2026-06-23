# HARNESS.md — Old World Builder

Harness global: `~/.config/opencode/`
Versión: 1.0.0 | Creado: 2026-06-23

---

## Comandos del proyecto

| Tipo | Comando | Notas |
|---|---|---|
| Test | `npm test` | react-scripts test (Jest) |
| Lint | `npx eslint src/` | ESLint configurado en package.json |
| Build | `npm run build` | react-scripts build |
| Start | `npm start` | react-scripts start (dev) |

## Documento SSOT del proyecto

Archivo principal: `AGENTS.md`

## Skills locales del proyecto

| Skill | Ruta |
|---|---|
| *(ninguna)* | |

## Stack

- **Frontend:** React 17, React DOM 17
- **Estado:** Redux Toolkit, React-Redux
- **Ruteo:** react-router-dom v5
- **i18n:** react-intl v6
- **Drag & drop:** react-beautiful-dnd
- **PWA:** Workbox (precaching, routing, strategies, Google Analytics)
- **Build:** react-scripts 5 (Create React App)
- **Testing:** Jest + @testing-library/react v11
- **Error tracking:** Sentry (@sentry/react)
- **Deploy:** gh-pages
- **Linting:** ESLint (react-app config)
- **Formato:** Prettier

## Testing worktree *(opcional)*

- Worktree de testing: `<ruta>`
- Commit fijo: `<tag>` (detached HEAD en `<hash>`)
- Independiente: `node_modules`, `package-lock.json` propios
- Sync desde el repo principal:
  ```powershell
  cd <ruta-worktree>
  git fetch ../<repo-dev> <branch>
  git checkout <nuevo-hash>
  npm install
  ```

## Convenciones

- Idioma: español (todas las respuestas del agente deben ser en español)
- No hay backend server — todo client-side con localStorage

## Archivos críticos

- `src/App.js` — ruteo principal y layout
- `src/store.js` — configuración de Redux store
- `src/state/` — slices de estado Redux
- `src/pages/` — componentes de página
- `public/` — assets estáticos y PWA manifest

## Harness activo

- [x] Agentes SDD globales disponibles
- [x] HARNESS.md completado
- [x] TDD (test runner configurado: npm test / Jest)
- [x] Post-edit verification activa
