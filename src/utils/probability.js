import { toHitRequired, toWoundRequired } from "./combat.js";

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

const nCk = (n, k) => factorial(n) / (factorial(k) * factorial(n - k));

export const singleD6Chance = (required) => {
  if (required < 2) return 1;
  if (required > 6) return 0;
  return (7 - required) / 6;
};

export const binomialProb = (trials, successes, p) => {
  if (successes > trials || p < 0 || p > 1) return 0;
  return nCk(trials, successes) * Math.pow(p, successes) * Math.pow(1 - p, trials - successes);
};

export const cumulativeProb = (trials, minSuccesses, p) => {
  if (minSuccesses > trials) return 0;
  if (minSuccesses <= 0) return 1;
  let sum = 0;
  for (let k = minSuccesses; k <= trials; k++) {
    sum += binomialProb(trials, k, p);
  }
  return Math.min(sum, 1);
};

export const oddsToHit = (attackerWS, defenderWS) => {
  const required = toHitRequired(attackerWS, defenderWS);
  return { required, chance: singleD6Chance(required) };
};

export const oddsToWound = (attackerS, defenderT) => {
  const required = toWoundRequired(attackerS, defenderT);
  return { required, chance: singleD6Chance(required) };
};

export const expectedUnsavedWounds = ({
  attacks = 0,
  hitChance = 0,
  woundChance = 0,
  saveChance = 0,
  wardChance = 0,
}) => attacks * hitChance * woundChance * (1 - (saveChance || 0)) * (1 - (wardChance || 0));

export const oddsFullPipeline = ({
  attacks,
  attackerWS,
  defenderWS,
  attackerS,
  defenderT,
  saveValue,
  wardValue,
}) => {
  const hitReq = toHitRequired(attackerWS, defenderWS);
  const woundReq = toWoundRequired(attackerS, defenderT);
  const hitChance = singleD6Chance(hitReq);
  const woundChance = singleD6Chance(woundReq);
  const saveChance = saveValue ? singleD6Chance(saveValue) : 0;
  const wardChance = wardValue ? singleD6Chance(wardValue) : 0;
  const expected = expectedUnsavedWounds({ attacks, hitChance, woundChance, saveChance, wardChance });
  return { expectedUnsaved: expected, hitChance, woundChance, saveChance, wardChance };
};

export const atLeastNWounds = ({
  attacks,
  attackerWS,
  defenderWS,
  attackerS,
  defenderT,
  saveValue,
  wardValue,
  minWounds,
}) => {
  const { hitChance, woundChance, saveChance, wardChance } = oddsFullPipeline({
    attacks, attackerWS, defenderWS, attackerS, defenderT, saveValue, wardValue,
  });
  const perAttackProb = hitChance * woundChance * (1 - saveChance) * (1 - wardChance);
  return cumulativeProb(attacks, minWounds, perAttackProb);
};
