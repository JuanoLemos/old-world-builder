import { createSlice } from "@reduxjs/toolkit";

import { getRandomId } from "../utils/id";

const PHASES = ["strategy", "movement", "shooting", "combat"];

export const battleSlice = createSlice({
  name: "battle",
  initialState: {
    activeBattleId: null,
    battles: {},
  },
  reducers: {
    setBattles: (state, { payload }) => {
      return payload || { activeBattleId: null, battles: {} };
    },
    createBattle: (state, { payload }) => {
      const { listId, name } = payload;
      const id = getRandomId();
      const now = new Date().toISOString();

      state.battles[id] = {
        id,
        listId,
        name,
        turn: 1,
        phase: "strategy",
        side: "own",
        ownUnits: {},
        opponentUnits: {},
        victoryPoints: {},
        createdAt: now,
        updatedAt: now,
      };
      state.activeBattleId = id;
    },
    selectBattle: (state, { payload }) => {
      state.activeBattleId = payload;
    },
    addUnitToBattle: (state, { payload }) => {
      const { battleId, side, unit } = payload;
      const battle = state.battles[battleId];
      if (!battle) return;

      const id = getRandomId();
      const woundsPerModel = unit.woundsPerModel || 1;
      const modelsTotal = unit.modelsTotal || unit.strength || 1;

      const battleUnit = {
        unitListId: unit.unitListId || unit.id || id,
        category: unit.category || "",
        label: unit.label || unit.name || "Unit",
        modelsTotal,
        modelsRemaining: modelsTotal,
        woundsPerModel,
        woundsTotal: modelsTotal * woundsPerModel,
        woundsRemaining: modelsTotal * woundsPerModel,
        characters: [],
        status: "active",
        engaged: false,
        notes: "",
      };

      const target = side === "opponent" ? "opponentUnits" : "ownUnits";
      battle[target][id] = battleUnit;
      battle.updatedAt = new Date().toISOString();
    },
    updateBattleUnit: (state, { payload }) => {
      const { battleId, unitId, changes, side } = payload;
      const battle = state.battles[battleId];
      if (!battle) return;

      const target = side === "opponent" ? "opponentUnits" : "ownUnits";
      const unit = battle[target][unitId];
      if (!unit) return;

      Object.assign(unit, changes);
      battle.updatedAt = new Date().toISOString();
    },
    updateCharacter: (state, { payload }) => {
      const { battleId, unitId, characterId, changes, side } = payload;
      const battle = state.battles[battleId];
      if (!battle) return;

      const target = side === "opponent" ? "opponentUnits" : "ownUnits";
      const unit = battle[target][unitId];
      if (!unit) return;

      const character = unit.characters.find((c) => c.id === characterId);
      if (!character) return;

      Object.assign(character, changes);
      battle.updatedAt = new Date().toISOString();
    },
    updateVictoryPoints: (state, { payload }) => {
      const { battleId, vp } = payload;
      const battle = state.battles[battleId];
      if (!battle) return;

      battle.victoryPoints = { ...battle.victoryPoints, ...vp };
      battle.updatedAt = new Date().toISOString();
    },
    advancePhase: (state, { payload }) => {
      const { battleId } = payload || {};
      const battle = state.battles[battleId || state.activeBattleId];
      if (!battle) return;

      const currentIndex = PHASES.indexOf(battle.phase);
      if (currentIndex < PHASES.length - 1) {
        battle.phase = PHASES[currentIndex + 1];
      } else {
        battle.phase = PHASES[0];
        battle.turn += 1;
      }
      battle.updatedAt = new Date().toISOString();
    },
    deleteBattle: (state, { payload }) => {
      const battleId = payload;
      delete state.battles[battleId];

      if (state.activeBattleId === battleId) {
        const remaining = Object.keys(state.battles);
        state.activeBattleId = remaining.length > 0 ? remaining[0] : null;
      }
    },
  },
});

export const {
  setBattles,
  createBattle,
  selectBattle,
  addUnitToBattle,
  updateBattleUnit,
  updateCharacter,
  updateVictoryPoints,
  advancePhase,
  deleteBattle,
} = battleSlice.actions;

export const selectActiveBattle = (state) =>
  state.battle.battles[state.battle.activeBattleId];

export const selectOwnUnits = (state) => {
  const battle = selectActiveBattle(state);
  return battle ? Object.values(battle.ownUnits) : [];
};

export const selectOpponentUnits = (state) => {
  const battle = selectActiveBattle(state);
  return battle ? Object.values(battle.opponentUnits) : [];
};

export default battleSlice.reducer;
