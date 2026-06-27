# ADR-003: Estrategia de backend y proveedor LLM

| Campo | Valor |
|---|---|
| **Decisión** | Implementar un backend/proxy ligero (serverless o Node simple) que maneje llamadas al LLM (RAG sobre la KB de reglas), gestión de claves y rate limiting. El MVP battle tracker (B01-B03) y el motor de combate (B04-B06) no necesitan backend — se añade en la fase de chatbot Q&A (B13). |
| **Estado** | Proposed |
| **Fecha** | 2026-06-23 |
| **Supersedes** | N/A |
| **Superseded by** | N/A |
| **Impacto** | Nuevo directorio `backend/` en el repo, CI/CD, gestión de claves, posible nuevo PaaS o contenedor |

## Contexto

Hoy el proyecto es 100% client-side (React SPA, sin backend, datos en localStorage + assets estáticos). Para incorporar un LLM (Q&A de reglas, narrador, asesor táctico) se necesita:

1. **Un LLM** (OpenAI / Anthropic / otro) — no existe modelo local viable para el alcance deseado.
2. **La KB de reglas** como contexto para RAG.
3. **Gestión de claves** — las claves de API no pueden ir en el frontend.
4. **Llamadas seguras** — evitar que el frontend llame directamente a la API del LLM (expondría la clave y permitiría abuso).

## Decisión

### Backend

Tecnología: **Node.js + Express** (mismo stack que el frontend, mínimo overhead mental).
Ubicación: `backend/` en el mismo repo (monorepo ligero, backend + frontend).
Deploy: opción PaaS (Railway, Fly.io, Render) o contenedor Docker.

Endpoints iniciales:
- `POST /api/chat` — Q&A de reglas: recibe pregunta + contexto de batalla, devuelve respuesta
- `GET /api/health` — health check

Futuro:
- `POST /api/narrate` — narración de evento de batalla
- `POST /api/advise` — sugerencia táctica
- `POST /api/enrich` — enriquecer estado de batalla (sugerir fases olvidadas)

### Pipeline RAG

- Embeddings pre-generados de la KB de reglas (almacenados en vector store ligero local)
- En cada request: embed pregunta → top-K chunks → prompt con contexto
- Costo mínimo por request

### Gestión de claves

- Variable de entorno en el backend
- Rate limiting por IP/sesión para evitar abuso
- Sin registro de usuarios en MVP (se añade si hay necesidad de persistencia multi-sesión)

### Timeline

- **MVP (B01-B08)**: Sin backend. Todo client-side.
- **KB de reglas (B09)**: Construcción del dataset. No requiere backend aún.
- **Backend + RAG (B12)**: Se implementa justo antes del chatbot Q&A (B13).
- **Narrador (B14) y Asesor (B15)**: Usan el mismo pipeline.

## Consecuencias

- ✅ El MVP arranca sin backend — reduce riesgo inicial
- ✅ Stack conocido: Node + Express, mismo lenguaje que el frontend
- ✅ Rate limiting evita abuso de API keys de terceros
- ⚠️ Costo variable del LLM (API calls) — depende del proveedor elegido
- ⚠️ Backend añade complejidad operativa (deploy, monitoreo, actualizaciones)
- ⚠️ Se necesita decidir proveedor LLM (OpenAI GPT-4o / Anthropic Claude / otro) cuando se implemente B12

---
*Lifecycle: Proposed → Accepted → Deprecated → Superseded*
