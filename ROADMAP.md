# ROADMAP — Old World Builder

Visión del producto: transformar la app de *constructor de listas de ejército* en un **compañero de batalla completo con asistente IA** para jugar Warhammer: The Old World en la mesa.

Las fases están secuenciadas para entregar valor client-side primero (tracker → motor de combate) antes de tocar backend, LLM y base de conocimiento de reglas.

---

## Ahora (Now)

| ID | Item | Prioridad | Estado | Depende de |
|----|------|-----------|--------|------------|
| B01 | Modelo de datos "sesión de batalla" + persistencia (localStorage) | P1 | 🔴 Pendiente | — |
| B02 | Tracker de partida: heridas, bajas, estado de unidad, fases de turno (extender game-view) | P1 | 🔴 Pendiente | B01 |
| B03 | Fix: hacer persistentes los Victory Points (hoy son efímeros en useState) | P2 | 🔴 Pendiente | B01 |

## Siguiente (Next)

| ID | Item | Prioridad | Estado | Depende de |
|----|------|-----------|--------|------------|
| B04 | Motor de dados determinista: to-hit (WS/BS), to-wound (S vs T), salvaciones/ward | P1 | 🔴 Pendiente | B02 |
| B05 | Resolución de combate: heridas, filas, estandarte, flanco/retaguardia, test de ruptura | P1 | 🔴 Pendiente | B04 |
| B06 | Calculadora de probabilidades (odds de combate, heridas esperadas) | P2 | 🔴 Pendiente | B04 |
| B07 | Soporte de ejército oponente (trackear unidades enemigas) | P2 | 🔴 Pendiente | B01 |
| B08 | Helper de carga/movimiento (rango, wheel) | P3 | 🔴 Pendiente | B02 |
| E01 | Proceso de revisión periódica de erratas oficiales de GW | P2 | 🔴 Pendiente | — |
| A01 | ADR-001: Arquitectura del battle companion (state, módulos) | P1 | 🔴 Pendiente | — |
| A02 | ADR-002: Postura legal/IP sobre contenido de reglas | P1 | 🔴 Pendiente | — |
| A03 | ADR-003: Estrategia de backend y proveedor LLM | P2 | 🔴 Pendiente | — |

## Futuro (Later)

| ID | Item | Prioridad | Estado | Depende de |
|----|------|-----------|--------|------------|
| B09 | KB de reglas: estructurar datos desde PDFs oficiales (efectos de reglas, hechizos, objetos mágicos, perfiles de armas) | P1 | 🔴 Pendiente | A02 |
| B10 | Browser/buscador de reglas offline en la app | P2 | 🔴 Pendiente | B09 |
| B11 | Integrar efectos de reglas en el motor de combate (Frenzy: +1A, Hatred: reroll, etc.) | P2 | 🔴 Pendiente | B05, B09 |
| B12 | Backend/proxy + pipeline RAG + gestión de claves LLM | P1 | 🔴 Pendiente | A03 |
| B13 | Chatbot Q&A de reglas (context-aware: tu ejército + estado de partida) | P1 | 🔴 Pendiente | B09, B12 |
| B14 | Narrador / log de batalla con IA | P2 | 🔴 Pendiente | B02, B12 |
| B15 | Asesor táctico IA | P3 | 🔴 Pendiente | B11, B13, B14 |
| E02 | Script/sistema de sync automático de erratas vs KB local | P2 | 🔴 Pendiente | E01, B09 |

## Completado

| Item | Instancia |
|------|-----------|
| R01 — Adaptación a metodología Diligencia v1.17.7 | v1.25.0 |

## Archivos relacionados

- `CHECKLIST.md` — Checklist de tareas operativas
- `CHANGELOG.md` — Historial de versiones
- `AGENTS.md` — Configuración del agente y mapeo de rutas
