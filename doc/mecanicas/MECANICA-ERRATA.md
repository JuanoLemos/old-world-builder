# MECANICA-ERRATA — Revisión periódica de erratas oficiales de The Old World

**Propósito:** Mantener la base de conocimiento de reglas sincronizada con las publicaciones oficiales de Games Workshop (errata PDFs, FAQs, actualizaciones).

**Responsable:** Equipo de mantenimiento del proyecto.

---

## Programa de revisión

| Frecuencia | Tipo | Trigger |
|------------|------|---------|
| Mensual | Revisión programada | Primer sábado de cada mes |
| Por incidencia | Revisión reactiva | Cuando un usuario reporta discrepancia vía /bug o Discord |
| Post-parche | Revisión tras publicación | Cuando GW publica una nueva errata/FAQ |

---

## Fuentes oficiales a monitorear

| Fuente | URL | Contenido |
|--------|-----|-----------|
| Warhammer Community — The Old World downloads | https://www.warhammer-community.com/warhammer-the-old-world-downloads/ | PDFs oficiales gratuitos (reglas básicas, listas de ejército, hojas de referencia) |
| Erratas y FAQs oficiales | Misma página que arriba | Documentos PDF que corrigen o aclaran reglas existentes |
| Warhammer Community — The Old World news | https://www.warhammer-community.com/ | Anuncios de nuevas publicaciones, erratas, cambios |

---

## Proceso de revisión mensual

```
1. CHECK: Visitar warhammer-community.com/the-old-world-downloads
    - Comparar fechas de los PDFs disponibles vs fechas registradas en la KB local
    - Si hay PDFs nuevos o actualizados → continuar
    - Si no → "Sin cambios" → detener

2. DOWNLOAD: Descargar los nuevos/actualizados PDFs
    - Almacenar en docs/errata/ con nombre y fecha (ej. "errata-core-rules-2026-06.pdf")

3. DIFF: Comparar contenido nuevo vs KB local
    - Identificar reglas modificadas, agregadas o eliminadas
    - Marcar cada cambio con severidad: ⚠️ breaking / 🔧 menor / 📝 solo texto

4. APPLY: Actualizar la KB de reglas (doc/kb/ o el formato que corresponda)
    - Cada cambio se registra en el archivo de cambio

5. LOG: Registrar en CHANGELOG.md
    - Entrada con formato:
      ### Changed
      - Sincronización de erratas GW (YYYY-MM-DD): [N] reglas actualizadas,
        [M] reglas agregadas, [P] reglas eliminadas

6. NOTIFY: Informar en Discord (si aplica) sobre actualizaciones que afecten
    datos de ejército o cálculo de puntos
```

---

## Formato de registro de erratas

Cada revisión deja un registro en `doc/arch/erratas-log.md` con este formato:

```
## YYYY-MM-DD — Revisión mensual

| Fuente | Estado | Cambios |
|--------|--------|---------|
| Core Rules PDF | ✅ Sin cambios | — |
| Forces of Fantasy | ⚠️ Actualizado | 3 reglas de Bretonnia corregidas |
| FAQ v2.1 | 🔧 Nueva | Aclaración sobre cobertura de terreno |

### Detalle de cambios
- Forces of Fantasy: "Blessed Steel" ahora otorga +1S (antes +2S) — 🔧 menor
- FAQ v2.1: Regla "Line of Sight" aclarada para unidades en bosques — 📝 solo texto
```

---

## Historial de revisiones

| Fecha | Resultado | Registrado por |
|-------|-----------|----------------|
| — | Sin revisiones aún | — |
