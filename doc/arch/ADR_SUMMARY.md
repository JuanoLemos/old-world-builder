# ADR_SUMMARY.md — Resumen de Decisiones Arquitectónicas

**Sistema:** Old World Builder
**Propósito:** Resumen ejecutivo de todas las ADRs activas del proyecto.

---

## Reglas del Sistema ADR

1. Toda decisión significativa debe tener un ADR.
2. Los ADRs deben referenciarse donde corresponda (código, docs, tareas).
3. Ciclo de vida: Proposed → Accepted → Deprecated → Superseded.
4. Mantener contexto actualizado en DILIGENCIA.md.

---

## ADRs Activos

| ADR | Decisión | Estado | Fecha | Impacto |
|---|---|---|---|---|
| 001 | Arquitectura battle companion: nuevo dominio Redux `battle` para estado de partida, persistente en localStorage | ✅ Accepted | 2026-06-23 | src/state, src/utils |
| 002 | Postura legal: KB de reglas desde PDFs oficiales gratuitos, sin texto literal GW, con revisión periódica de erratas | 💡 Proposed | 2026-06-23 | Reglas KB, pipeline datos |
| 003 | Backend/proxy Node.js + Express para LLM + RAG. MVP client-side sin backend | 💡 Proposed | 2026-06-23 | backend/ nuevo |

---

## Estadísticas

| Métrica | Valor |
|---|---|
| **Total ADRs** | 3 |
| **Aceptados** | 1 |
| **Propuestos** | 2 |
| **Obsoletos** | 0 |

---

## Template

Usar [adr-template.md](adr-template.md) para nuevas decisiones.

## Referencias

- `doc/arch/adr-template.md` — template para nuevas ADRs
- `DILIGENCIA.md` — convención de estructura del proyecto
