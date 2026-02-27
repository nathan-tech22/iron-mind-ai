/**
 * IRON-MIND AI: CORE STRENGTH LOGIC
 */

/**
 * 1RM Estimation Formulas
 */
export const estimate1RM = {
  // Brzycki: Weight / (1.0278 - (0.0278 * Reps))
  brzycki: (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return Math.round(weight / (1.0278 - (0.0278 * reps)));
  },
  // Epley: Weight * (1 + (Reps / 30))
  epley: (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + (reps / 30)));
  }
};

/**
 * Calculate Barbell Plate Loading
 * Returns an array of plates needed per side
 */
export const calculatePlates = (targetWeight: number) => {
  const barWeight = 45;
  let sideWeight = (targetWeight - barWeight) / 2;
  const plates: number[] = [];
  const standardPlates = [45, 25, 15, 10, 5, 2.5];

  for (const plate of standardPlates) {
    while (sideWeight >= plate) {
      plates.push(plate);
      sideWeight -= plate;
    }
  }
  return plates;
};

/**
 * 5/3/1 Cycle Progression
 * Squat/Deadlift +10lbs, Bench/Press +5lbs
 */
export const advanceCycle = (currentTM: number, liftName: string) => {
  const increment = (liftName === 'SQUAT' || liftName === 'DEADLIFT') ? 10 : 5;
  return currentTM + increment;
};
