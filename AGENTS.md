# Old World Builder — AGENTS.md

## Idioma

Español — todas las respuestas del agente deben ser en español. Si el agente contesta en inglés, recordarle explícitamente que responda en español.

## Mapeo de rutas

| Variable | Ruta | Descripción |
|----------|------|-------------|
| $RM | `ROADMAP.md` | Roadmap del proyecto |
| $ADRS | `doc/arch/` | Architecture Decision Records |
| $CHANGELOG | `CHANGELOG.md` | Historial de versiones |
| $CHECKLIST | `CHECKLIST.md` | Checklist de tareas operativas |
| $SISTEMA | `doc/arch/SISTEMA.md` | Documento de sistema (arquitectura, stack, dependencias) |
| $GUIAS | `doc/guias/` | Guías de uso, configuración, contribución |
| $MECANICAS | `doc/mecanicas/` | Reglas de negocio / mecánicas del proyecto |
| $TESTING | `npm test` | Comando de test del proyecto |
| $HARNESS | `.opencode/HARNESS.md` | Configuración de harness (test, lint, skills, stack) |
| $COMMANDS_DIR | `.opencode/commands/` | Comandos locales del proyecto |
| $PEND | `doc/pendientes/` | Pendientes de revisión |
| $QA | `doc/qa/` | Situaciones a revisar (QA) |
| $BUGS | `doc/arch/bugs.md` | Bug tracker (P1/P2/P3, severidad, estado) |
| $INCIDENTS | `doc/arch/incidentes.md` | Incidentes runtime y crashes |
| $NEWS | `doc/news/` | Cambios entrantes a distribuir |
| $MAIN_APP | `src/App.js` | Archivo principal de la aplicación |
| $CRITICAL_FILES | `src/App.js`, `src/store.js` | Archivos para backup crítico |
| $ERRATA | `doc/mecanicas/MECANICA-ERRATA.md` | Proceso de revisión de erratas oficiales GW |

## Comandos del proyecto

| Comando | Qué hace | Tipo |
|---------|----------|------|
| /commit | Commit rápido con formato | Global |
| /debug | Análisis profundo de sección | Global |
| /plan | Planificar tarea en modo lectura | Global |
| /health | Verificar integridad del código | Global |
| /limpiar | Eliminar archivos temporales | Global |
| /estado | Reporte rápido del proyecto | Local |
| /* | Próximos 5 pasos | Local |
| /checklist | Cruce RM + Checklist | Local |
| /rm | Revisar Roadmap | Local |
| /foco | Cargar contexto de área | Local |
| /updoc | Actualizar documentación | Local |

## Comandos fundamentales heredados

| Comando | Descripción |
|---------|-------------|
| /+guia | Agregar guía al catálogo INDEX |
| /+mec | Agregar mecánica al catálogo INDEX |
| /+pend | Agregar pendiente |
| /+rm | Agregar item al roadmap |
| /+rmi | Insertar item al inicio del roadmap |
| /ADAPTAR-COMANDOS | Documentación de comandos adaptados |
| /apply | Aplicar plan de tareas |
| /backup | Backup manual |
| /backupall | Backup completo |
| /bug | Reportar bug |
| /CBP | Commit-Build-Plan (orquestador) |
| /circuito | Siguiente paso en el circuito |
| /consejo | Consejo de arquitectura |
| /checklist | Cruzar RM + Checklist |
| /commit | Commit rápido con formato |
| /debug | Análisis profundo de sección |
| /deprecar | Deprecar ADR |
| /deprecados | Comandos deprecados |
| /diligencia-check | Verificar estructura Diligencia |
| /doctor | Diagnóstico integral |
| /estado | Reporte rápido del proyecto |
| /explica | Explicar sección de código |
| /foco | Cargar contexto de área |
| /head | Mostar primeras líneas de archivos |
| /health | Verificar integridad del código |
| /incidente | Reportar incidente runtime |
| /informe-salud | Reporte de salud inter-proyecto |
| /legal | Revisar cumplimiento legal |
| /limpiar | Eliminar archivos temporales |
| /mutacion | Registrar mutación experimental |
| /news | Distribuir cambios |
| /next | Próximos 5 pasos |
| /notify | Notificar cambio en el proyecto |
| /PENDING | Pendientes críticos |
| /plan | Planificar tarea en modo lectura |
| /pushgh | Push a GitHub |
| /qa | Registrar situación QA |
| /reanudar | Recuperar sesión interrumpida |
| /report | Generar reporte |
| /revision | Revisión de archivo |
| /rm | Revisar Roadmap |
| /salud | Salud del proyecto |
| /updoc | Actualizar documentación |
| /upguia | Actualizar guía en INDEX |
| /upmec | Actualizar mecánica en INDEX |
| /version | Bump semver + CHANGELOG |

## Foco por área

- `ui` → Frontend: componentes, estilos, interacción React
- `ux` → Experiencia: guías, mecánicas, diseño de interacción
- `data` → Datasets: estructuras JSON de ejércitos, traducciones, editor de datasets
- `battle` → Motor de batalla: tracker de partida, dados, combate, probabilidades
- `ai` → Inteligencia artificial: backend LLM, RAG, chatbot Q&A, asesor táctico

## Disciplina BUILD

BUILD = aplicar cambios, NO commitear. Solo /commit, /CBP y /version ejecutan git commit.
Al terminar cualquier BUILD en este proyecto, reportar cambios aplicados y sugerir /CBP.

## Skills

<!-- Agregar skills específicos del proyecto si aplican -->

## Archivos relacionados

- `ROADMAP.md` — Roadmap del proyecto
- `CHECKLIST.md` — Checklist de tareas operativas
- `CHANGELOG.md` — Historial de versiones
- `DILIGENCIA.md` — Sello de metodología
- `INDEX.md` — Catálogo de documentación
