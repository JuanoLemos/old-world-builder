const WS_TABLE = {
  double: 2,
  higher: 3,
  equal: 4,
  lower: 5,
  half: 6,
};

const ST_TABLE = {
  double: 2,
  higher: 3,
  equal: 4,
  lower: 5,
  half: 6,
};

const validRolls = (rolls) =>
  (rolls || []).filter((r) => Number.isInteger(r) && r >= 1 && r <= 6);

export const toHitRequired = (attackerStat, defenderStat) => {
  if (attackerStat >= defenderStat * 2) return WS_TABLE.double;
  if (attackerStat > defenderStat) return WS_TABLE.higher;
  if (attackerStat === defenderStat) return WS_TABLE.equal;
  if (attackerStat > Math.floor(defenderStat / 2)) return WS_TABLE.lower;
  return WS_TABLE.half;
};

export const toWoundRequired = (attackerS, defenderT) => {
  if (attackerS >= defenderT * 2) return ST_TABLE.double;
  if (attackerS > defenderT) return ST_TABLE.higher;
  if (attackerS === defenderT) return ST_TABLE.equal;
  if (attackerS > Math.floor(defenderT / 2)) return ST_TABLE.lower;
  return ST_TABLE.half;
};

export const resolveHits = (required, diceRolls) => {
  const rolls = validRolls(diceRolls);
  const results = rolls.map((r) => r >= required);
  return { hits: results.filter(Boolean).length, results };
};

export const resolveWounds = (required, diceRolls) => {
  const rolls = validRolls(diceRolls);
  const results = rolls.map((r) => r >= required);
  return { wounds: results.filter(Boolean).length, results };
};

export const resolveSaves = (woundCount, saveValue, diceRolls) => {
  const rolls = validRolls(diceRolls).slice(0, woundCount);
  const padded = [...rolls];
  while (padded.length < woundCount) padded.push(0);
  const results = padded.map((r) => r >= (saveValue || 7));
  return {
    unsaved: results.filter((s) => !s).length,
    saved: results.filter(Boolean).length,
    results,
  };
};

export const resolveWardSave = (unsavedCount, wardValue, diceRolls) => {
  const rolls = validRolls(diceRolls).slice(0, unsavedCount);
  const padded = [...rolls];
  while (padded.length < unsavedCount) padded.push(0);
  const results = padded.map((r) => r >= (wardValue || 7));
  return {
    final: results.filter((s) => !s).length,
    savedByWard: results.filter(Boolean).length,
    results,
  };
};

export const resolveCombat = ({
  attackerWS,
  defenderWS,
  attackerS,
  defenderT,
  hitRolls,
  woundRolls,
  saveValue,
  saveRolls,
  wardValue,
  wardRolls,
}) => {
  const hitRequired = toHitRequired(attackerWS, defenderWS);
  const { hits, results: hitResults } = resolveHits(
    hitRequired,
    hitRolls || [],
  );

  const woundRequired = toWoundRequired(attackerS, defenderT);
  const { wounds, results: woundResults } = resolveWounds(
    woundRequired,
    woundRolls || [],
  );

  const woundsToSave = Math.min(wounds, hits);
  const { unsaved, saved, results: saveResults } = resolveSaves(
    woundsToSave,
    saveValue,
    saveRolls || [],
  );

  const { final, savedByWard, results: wardResults } = resolveWardSave(
    unsaved,
    wardValue,
    wardRolls || [],
  );

  return {
    hitRequired,
    hits,
    woundRequired,
    wounds,
    unsaved,
    finalWounds: final,
    rolls: {
      hit: hitResults,
      wound: woundResults,
      save: saveResults,
      ward: wardResults,
    },
  };
};

export const getRankBonus = (modelsPerRank, totalModels) => {
  if (modelsPerRank <= 0 || totalModels <= 0) return 0;
  const fullRanks = Math.floor(totalModels / modelsPerRank);
  return Math.min(Math.max(0, fullRanks - 1), 3);
};

export const calculateSideCR = ({
  wounds = 0,
  rankBonus = 0,
  hasStandard = false,
  flank = false,
  rear = false,
  charge = false,
}) =>
  wounds
  + rankBonus
  + (hasStandard ? 1 : 0)
  + (flank ? 1 : 0)
  + (rear ? 2 : 0)
  + (charge ? 1 : 0);

export const resolveBreakTest = ({
  leadership = 7,
  crLostBy = 0,
  steadfast = false,
  BSBinRange = false,
}) => {
  const penalty = steadfast ? 0 : crLostBy;
  const effectiveLd = Math.max(2, leadership - penalty);
  const breakOn = Math.max(2, effectiveLd + 1);
  return { penalty, effectiveLd, breakOn, useBSBReroll: BSBinRange };
};

export const resolveFullCombat = ({
  own: {
    wounds: ownWounds,
    rankBonus: ownRanks,
    hasStandard: ownStd,
    flank: ownFlank,
    rear: ownRear,
    charge: ownCharge,
    leadership: ownLd,
    steadfast: ownSteadfast,
    bsbInRange: ownBSB,
  },
  opponent: {
    wounds: oppWounds,
    rankBonus: oppRanks,
    hasStandard: oppStd,
    flank: oppFlank,
    rear: oppRear,
    charge: oppCharge,
    leadership: oppLd,
    steadfast: oppSteadfast,
    bsbInRange: oppBSB,
  },
}) => {
  const ownCR = calculateSideCR({
    wounds: ownWounds, rankBonus: ownRanks,
    hasStandard: ownStd, flank: ownFlank, rear: ownRear, charge: ownCharge,
  });
  const opponentCR = calculateSideCR({
    wounds: oppWounds, rankBonus: oppRanks,
    hasStandard: oppStd, flank: oppFlank, rear: oppRear, charge: oppCharge,
  });

  const difference = ownCR - opponentCR;
  const loser = difference === 0 ? null : difference > 0 ? "opponent" : "own";
  const crLostBy = Math.abs(difference);

  const loserOpts = loser === "own"
    ? { leadership: ownLd, steadfast: ownSteadfast, bsbInRange: ownBSB }
    : loser === "opponent"
    ? { leadership: oppLd, steadfast: oppSteadfast, bsbInRange: oppBSB }
    : null;

  const breakTest = loserOpts
    ? resolveBreakTest({ ...loserOpts, crLostBy })
    : null;

  return { ownCR, opponentCR, difference, loser, breakTest };
};
