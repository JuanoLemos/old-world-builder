# ADR-001: Arquitectura del battle companion

| Campo | Valor |
|---|---|
| **Decisión** | Extender la arquitectura actual (React + Redux + localStorage) con un nuevo dominio "battle" para el estado de partida, manteniendo la separación del dominio "lists" existente. |
| **Estado** | Accepted |
| **Fecha** | 2026-06-23 |
| **Supersedes** | N/A |
| **Superseded by** | N/A |
| **Impacto** | src/state/ (nuevo slice battle), src/pages/game-view/ (refactor mayor), src/utils/ (nuevos módulos battle/combat) |

## Contexto

El proyecto hoy maneja dos dominios en Redux:
- `lists` — listas de ejército del usuario (persistente en localStorage)
- `army` / `items` — datos de catálogo cargados bajo demanda (efímeros)

La vista de partida (`game-view`) es un lector de la lista + calculador de VP efímero (useState). No hay modelo de datos para el estado de una partida en curso.

Necesitamos un modelo que permita:
- Trackear heridas, bajas y estado de cada unidad durante la partida
- Avanzar por fases de turno (Strategy, Movement, Shooting, Combat)
- Soportar ejército propio y oponente
- Persistir entre recargas (localStorage), con opción futura a sync backend
- Alimentar un motor de combate determinista (ADR-003 lo conectará al LLM)

## Decisión

Crear un nuevo dominio `battle` en Redux con su propio slice, separado del dominio `lists`.

### Modelo de datos

```
battle: {
  activeBattleId: string | null,
  battles: {
    [battleId]: {
      id: string,
      listId: string,              // referencia a la lista en lists[]
      name: string,
      turn: number,                // 1, 2, 3...
      phase: "strategy" | "movement" | "shooting" | "combat",
      side: "own" | "opponent",
      ownUnits: { [unitId]: BattleUnit },
      opponentUnits: { [unitId]: BattleUnit },
      victoryPoints: { ... },     // mismo modelo que hoy pero persistente
      createdAt: string,
      updatedAt: string
    }
  }
}

BattleUnit: {
  unitListId: string,             // id de la unidad en la lista original
  category: string,               // characters/core/special/rare
  label: string,                  // nombre para mostrar (ej: "State Troops A")
  modelsTotal: number,            // strength inicial
  modelsRemaining: number,        // strength actual (bajas)
  woundsPerModel: number,         // W de la statline
  woundsTotal: number,            // woundsTotal = modelsTotal * woundsPerModel
  woundsRemaining: number,        // woundsRemaining = woundsRemaining
  characters: [{
    id: string,                   // champion, general, etc.
    label: string,
    woundsTotal: number,
    woundsRemaining: number
  }],
  status: "active" | "fled" | "dead" | "fleeing",
  engaged: boolean,               // en combate cuerpo a cuerpo
  notes: string
}
```

### Módulos nuevos

| Módulo | Ruta | Propósito |
|--------|------|-----------|
| `src/state/battle.js` | Redux slice: acciones y reducer del dominio battle | |
| `src/utils/battle.js` | Funciones puras: crear batalla, calcular bajas, avanzar fase | |
| `src/utils/combat.js` | Motor de combate: to-hit, to-wound, saves, resolución (determinista) | |
| `src/utils/probability.js` | Calculadora de probabilidades (binomial, odds) | |

### Persistencia

- `battle.battles[]` → localStorage con key `owb.battles` (mismo patrón que `owb.lists`)
- `battle.activeBattleId` → sessionStorage (no persiste entre sesiones de navegador)
- MVP: localStorage solamente. Futuro: sync opcional vía backend.

## Consecuencias

- ✅ Separación clara entre "lo que construiste en la lista" y "lo que pasa en la partida"
- ✅ El motor de combate puede funcionar standalone (probable candidato a TDD)
- ✅ Path de migración: la vista de game-view actual se refactoriza para consumir `battle` en vez de useState
- ⚠️ Las listas existentes en `owb.lists` no se migran automáticamente — el usuario inicia una batalla desde una lista
- ⚠️ localStorage tiene límite (~5-10 MB). Batallas largas con muchas unidades + logs podrían requerir compresión futura

---
*Lifecycle: Proposed → Accepted → Deprecated → Superseded*
