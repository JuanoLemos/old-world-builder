const D6_2_PROBS = [0, 0, 36, 35, 33, 30, 26, 21, 15, 10, 6, 3, 1].map(
  (v) => v / 36,
);
// D6_2_PROBS[n] = P(2d6 >= n), n from 2 to 12
// For n <= 1: 1.0 (always succeeds). For n >= 13: 0 (impossible).

export const chargeRange = (movement = 0) => ({
  min: movement + 2,
  avg: movement + 7,
  max: movement + 12,
});

export const chargeOdds = (distance, movement = 0) => {
  const needed = Math.ceil(distance - movement);
  if (needed <= 2) return 1;
  if (needed > 12) return 0;
  return D6_2_PROBS[needed];
};

export const wheelCost = (unitWidth, degrees) =>
  Math.PI * unitWidth * (Math.abs(degrees) / 360);

export const remainingMovement = (movement = 0, unitWidth = 0, wheelDegrees = 0) =>
  Math.max(0, movement - wheelCost(unitWidth, wheelDegrees));

export const marchDistance = (movement, multiplier = 2) => movement * multiplier;

export const chargeDeclare = (distance, movement, unitWidth = 0, wheelDegrees = 0) => {
  const remaining = remainingMovement(movement, unitWidth, wheelDegrees);
  const odds = chargeOdds(distance, remaining);
  return { odds, remainingMovement: remaining, canDeclare: odds > 0 };
};
