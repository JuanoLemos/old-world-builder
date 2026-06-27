# CHANGELOG — Old World Builder

Todos los cambios notables en este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [1.27.0] - 2026-06-27

### Added
- B01: Modelo de datos "sesión de batalla" + persistencia (src/state/battle.js)
- B02: Tracker de partida (heridas, bajas, estado, fases de turno en game-view)
- B03: Victory Points persistentes (de useState a battle slice)
- B04: Motor de dados determinista (src/utils/combat.js)
- B05: Resolución de combate (heridas, filas, estandarte, flanco, test de ruptura)
- B06: Calculadora de probabilidades (src/utils/probability.js)
- B07: Soporte de ejército oponente (add, tracker, remove)
- B08: Helper de carga/movimiento (src/utils/battle.js)
- B09: Knowledge Base de reglas (special-rules, weapons, armor, magic-items)
- docs/datasets.md: documentación del formato KB

## [1.26.0] - 2026-06-27

### Added
- 3 ADRs (001: battle companion, 002: legal errata, 003: backend LLM)
- MECANICA-ERRATA.md y erratas-log.md
- Comandos /circuito, /consejo, /deprecados
- Directorios doc/pendientes/, doc/news/
- Cross-refs en 6 documentos raíz
- INDEX.md: sistema/tracker y plantillas/meta sections

### Changed
- DILIGENCIA.md: upgrade v1.17.7 → v1.20.0
- AGENTS.md: agregados $COMMANDS_DIR, $PEND, $NEWS + 3 comandos
- 7 comandos stale sobrescritos del global
- INDEX.md sincronizado con versiones y archivos faltantes
- status-salud.md actualizado
- scripts/check-docs.js sincronizado con template v1.20.0

## [1.25.0] - 2026-06-23

### Added
- Adaptación a metodología Diligencia v1.17.7 (estructura documental, AGENTS.md, ROADMAP.md, INDEX.md, HARNESS.md)
- Comandos fundamentales (43) copiados a `.opencode/commands/`
- Script check-docs.js para validación de integridad documental
- Documento de sistema SISTEMA.md con arquitectura del proyecto
- Guías: identidad.md, MANDATO.md, UX-CHECKLIST.md
- Enforcement documental: pre-commit hook + check-docs script

### Changed
- package.json: agregado script `check-docs`
- HARNESS.md movido de raíz a `.opencode/HARNESS.md`

## [1.24.1] - 2026-06-23

### Added
- Versión actual del proyecto (React 17 + Redux + Workbox PWA)

## Archivos relacionados

- `ROADMAP.md` — Roadmap del proyecto
- `CHECKLIST.md` — Checklist de tareas operativas
- `AGENTS.md` — Configuración del agente y mapeo de rutas
