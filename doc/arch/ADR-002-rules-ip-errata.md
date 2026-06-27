# ADR-002: Postura legal/IP sobre contenido de reglas y revisión de erratas

| Campo | Valor |
|---|---|
| **Decisión** | La base de conocimiento de reglas se construirá exclusivamente a partir de fuentes oficiales gratuitas publicadas por Games Workshop (PDFs descargables de The Old World, erratas oficiales), sin reproducir texto literal protegido por copyright cuando sea evitable, y con un proceso de revisión periódica de erratas. |
| **Estado** | Proposed |
| **Fecha** | 2026-06-23 |
| **Supersedes** | N/A |
| **Superseded by** | N/A |
| **Impacto** | doc/mecanicas/MECANICA-ERRATA.md, KB de reglas (B09/B10/B11), pipeline de datos |

## Contexto

El reglamento de Warhammer: The Old World (reglas básicas, perfiles de unidades, objetos mágicos, hechizos) está contenido en libros publicados por Games Workshop. Sin embargo:

1. GW publica **gratuita y oficialmente** varios PDFs descargables: las listas de ejército ("Forces of Fantasy", "Ravening Hordes"), reglas básicas condensadas, y algunos materiales de apoyo.
2. GW publica periódicamente **erratas y FAQs oficiales** en PDF que actualizan o corrigen las reglas.
3. El sitio `tow.whfb.app` (fan-site) compila y estructura estos datos oficiales de forma accesible vía web. No es un sitio de scraping ilegal — estructura datos de fuentes oficiales gratuitas.
4. La implementación de un asistente IA para batalla requiere **conocer los efectos concretos** de las reglas (ej. "Frenzy gives +1 Attack and requires a charge"), no solo sus nombres como ocurre hoy.
5. Reproducir texto literal con copyright de GW en la app podría crear problemas legales a pesar de que el proyecto es not-for-profit y "completely unofficial".

## Decisión

### Fuente de datos

Primaria: PDFs oficiales gratuitos de GW (descarga directa).
Secundaria: datos estructurados derivados de `tow.whfb.app` (que a su vez derivan de los PDFs oficiales).

NO se reproducirá texto literal de las reglas con copyright cuando exista una alternativa:
- Las **mecánicas** (tablas de to-hit, to-wound, cálculos) no son copyrightables — se codificarán como tablas numéricas o reglas de negocio.
- Los **efectos de reglas** se describirán con lenguaje parafraseado propio.
- Los **nombres** de reglas especiales, objetos y unidades son nombres propios del juego (GW los usa como marcas), se referenciarán directamente.

### Proceso de erratas

Se establece un proceso de revisión periódica (ver `doc/mecanicas/MECANICA-ERRATA.md`):
- **Trigger mensual**: check manual o semiautomático de nuevas erratas publicadas por GW en warhammer-community.com.
- **Trigger por incidencia**: si un usuario reporta una discrepancia (vía /bug o Discord), se revisa contra la última errata.
- **Actualización**: la KB de reglas se actualiza y se registra en CHANGELOG qué cambió.

### Postura para el LLM

El LLM (cuando se integre en fases posteriores) recibirá como contexto:
- Las reglas parafraseadas (no texto literal)
- Las tablas de resolución mecánica
- El estado de batalla actual

El LLM NO se entrenará con datos de GW; se usará RAG sobre la KB propia.

## Consecuencias

- ✅ Riesgo legal bajo: todo deriva de fuentes oficiales gratuitas, no se reproduce texto literal
- ✅ La KB puede versionarse y auditarse
- ✅ Compatible con la licencia CC BY 4.0 del proyecto
- ⚠️ Mantener la KB actualizada contra erratas requiere disciplina mensual
- ⚠️ El sitio tow.whfb.app podría cambiar/desaparecer — tener un pipeline reproducible desde PDFs oficiales protege contra eso

---
*Lifecycle: Proposed → Accepted → Deprecated → Superseded*
