# Dataset format

The dataset for each army is defined in a [JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) format.

## Rules Knowledge Base (KB)

La base de conocimiento de reglas vive en `public/games/the-old-world/rules/`. Archivos JSON indexados por ID que definen efectos, perfiles y objetos del juego. Sigue la postura legal definida en ADR-002: sin texto literal de GW, lenguaje parafraseado propio.

### Estructura de archivos

| Archivo | Contenido |
|---------|-----------|
| `special-rules.json` | Mapa de ID de regla → nombre, efecto, categoría, fase, fuente |
| `weapons.json` | Perfiles de armas (rango, fuerza, reglas especiales, tipo) |
| `armor.json` | Tipos de armadura (salvación, bonos, reglas especiales) |
| `magic-items.json` | Objetos mágicos (categoría, puntos, efecto, uso único) |

### Formato de entrada (special-rules.json)

```javascript
{
  "rule-id": {
    "name": { "en": "English name", "es": "Nombre español" },
    "category": "combat | morale | defense",
    "phase": "combat | movement | shooting | any | both",
    "effect": {
      "en": "Paraphrased description of the rule effect.",
      "es": "Descripción parafraseada del efecto de la regla."
    },
    "source": "Reference to the official free PDF."
  }
}
```

### Formato de entrada (weapons.json)

```javascript
{
  "weapon-id": {
    "name": { "en": "Name", "es": "Nombre" },
    "range": Number,
    "strength": "user | +N | Number",
    "specialRules": ["rule-id", ...],
    "type": "melee | ranged"
  }
}
```

### Contribuir nuevas reglas

1. Crear una entrada en el archivo JSON correspondiente con ID único (kebab-case)
2. La descripción debe ser parafraseada, no copia literal del texto de GW
3. Incluir `source` para trazabilidad
4. Mantener el mismo formato multidioma que los datasets

Datasets can be downloaded on the [Custom datasets](https://old-world-builder.com/custom-datasets) page.

You can also use our [Datasets editor](https://old-world-builder.com/datasets), no coding required.

> !! Attention: The Datasets Editor has not been updated for some time and no longer reflects the current format of the datasets.

## Army structure

### Warhammer: The Old World

```javascript
{
  "characters": [],
  "core": [],
  "special": [],
  "rare": [],
  "mercenaries": [],
  "allies": [],
}
```

## All unit options

```javascript
{
  "id": String, // Unique ID, example: "orc-warboss"
  "name_en": String, // English name
  "name_de": String, // German name
  "name_fr": String, // French name
  "name_es": String, // Spanish name
  "name_it": String, // Italian name
  "name_pl": String, // Polish name
  "name_cn": String, // Chinese name
  "named": Boolean, // Used for composition rules validation
  "points": Number, // Points for each model
  "minimum": Number, // Minimum number of models of the unit
  "maximum": Number, // Maximum number of models of the unit
  "magicItemsArmy": String, // Category the unit can take magic items from, optional
  "maxSignatureSpells": Number, // Number of maximum signature spells
  "army": String, // Only in mercanaries category, army ID, optional
  "armyComposition": { // Army composition specific options, optional
    [army composition ID]: { // Example: "troll-horde"
      "category": "characters" | "core" | "special" | "rare", // Category where the unit can be added
      "notes": { // Optional
        "name_en": String,
        "name_de": String,
        "name_fr": String,
        "name_es": String,
        "name_it": String,
        "name_pl": String,
        "name_cn": String
      },
      "specialRules" { // The english name is used for the rules popup window, optional
        "name_en": String,
        "name_de": String,
        "name_fr": String,
        "name_es": String,
        "name_it": String,
        "name_pl": String,
        "name_cn": String
      }
    }
  },
  "command": [ // A list of all command options, optional
    {
      "name_en": String,
      "name_de": String,
      "name_fr": String,
      "name_es": String,
      "name_it": String,
      "name_pl": String,
      "name_cn": String,
      "points": Number,
      "alwaysActive": Boolean, // Always selected and cannot be deselected, optional
      "magic": {
        "types": [String], // Limit the available magic items (see "magic-items.json" types)
        "maxPoints": Number, // Maximum points for magic items
        "notes": { // Optional
          "name_en": String,
          "name_de": String,
          "name_fr": String,
          "name_es": String,
          "name_it": String,
          "name_pl": String,
          "name_cn": String
        }
      }
    }
  ],
  "equipment": [ // All weapon options, they are mutually exclusive
    {
      "name_en": String,
      "name_de": String,
      "name_fr": String,
      "name_es": String,
      "name_it": String,
      "name_pl": String,
      "name_cn": String,
      "points": Number,
      "perModel": Boolean, // Wether the points are counted per model, optional
      "active": Boolean, // Wether it should be selected by default, optional
      "equippedDefault": Boolean, // Weather it should always show up, even if deselected (e.g. for Hand weapons), optional
      "armyComposition": [army composition IDs], // Only available for those army compositions, optional
      "notes": { // Optional
        "name_en": String,
        "name_de": String,
        "name_fr": String,
        "name_es": String,
        "name_it": String,
        "name_pl": String,
        "name_cn": String
      }
    }
  ],
  "armor": [ // All armor options, they are mutually exclusive
    {
      "name_en": String,
      "name_de": String,
      "name_fr": String,
      "name_es": String,
      "name_it": String,
      "name_pl": String,
      "name_cn": String,
      "points": Number,
      "perModel": Boolean, // Optional
      "active": Boolean, // Optional
      "equippedDefault": Boolean, // Optional
      "armyComposition": [army composition IDs], // Optional
      "notes": { // Optional
        "name_en": String,
        "name_de": String,
        "name_fr": String,
        "name_es": String,
        "name_it": String,
        "name_pl": String,
        "name_cn": String
      }
    }
  ],
  "options": [ // All options, they are NOT mutually exclusive
    {
      "name_en": String,
      "name_de": String,
      "name_fr": String,
      "name_es": String,
      "name_it": String,
      "name_pl": String,
      "name_cn": String,
      "points": Number,
      "perModel": Boolean, // Optional
      "active": Boolean, // Optional
      "alwaysActive": Boolean, // Always selected and cannot be deselected, optional
      "stackable": Boolean, // Allows multiple selections of this option
      "minimum": Number, // Minimum number of this option
      "maximum": Number, // Maximum number of this option
      "armyComposition": [army composition IDs], // Optional
      "requiredMagicItem": String, // Name of a required magic item
      "notes": { // Optional
        "name_en": String,
        "name_de": String,
        "name_fr": String,
        "name_es": String,
        "name_it": String,
        "name_pl": String,
        "name_cn": String
      }
    }
  ],
  "mounts": [ // All mount options, they are mutually exclusive
    {
      "name_en": String,
      "name_de": String,
      "name_fr": String,
      "name_es": String,
      "name_it": String,
      "name_pl": String,
      "name_cn": String,
      "points": Number,
      "active": Boolean, // Wether it should be selected by default
      "perModel": Boolean, // Optional
      "active": Boolean, // Optional
      "armyComposition": [army composition IDs], // Optional
      "options": [ // Mount options, optional
        {
          "name_en": String,
          "name_de": String,
          "name_fr": String,
          "name_es": String,
          "name_it": String,
          "name_pl": String,
          "name_cn": String,
          "points": Number,
          "notes": [
            {
              "name_en": String,
              "name_de": String,
              "name_fr": String,
              "name_es": String,
              "name_it": String,
              "name_pl": String,
              "name_cn": String,
            }
          ]
        }
      ],
      "notes": { // Optional
        "name_en": String,
        "name_de": String,
        "name_fr": String,
        "name_es": String,
        "name_it": String,
        "name_pl": String,
        "name_cn": String
      }
    }
  ],
  "items": [ // Magic items or powers are defined in the "magic-items.json" file
    {
      "name_en": String,
      "name_de": String,
      "name_fr": String,
      "name_es": String,
      "name_it": String,
      "name_pl": String,
      "name_cn": String
      "types": [String],
      "maxPoints": Number, // Optional
      "notes": { // Optional
        "name_en": String,
        "name_de": String,
        "name_fr": String,
        "name_es": String,
        "name_it": String,
        "name_pl": String,
        "name_cn": String
      }
    }
  ],
  "lores": [String], // Lores are defined in the "lores-of-magic-with-spells.json" file, optional
  "specialRules" { // Optional
    "name_en": String,
    "name_de": String,
    "name_fr": String,
    "name_es": String,
    "name_it": String,
    "name_pl": String,
    "name_cn": String
  }
}
```
