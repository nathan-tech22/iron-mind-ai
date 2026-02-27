export const calculateWorkout = (tm: number, week: number, tmOverride?: number) => {
  // If a temporary override is provided (e.g. testing 85% vs 90%), 
  // we adjust the base TM before calculating percentages.
  // Standard 5/3/1 is usually calculated off 90% of 1RM.
  const effectiveTM = tmOverride ? (tm * (tmOverride / 90)) : tm;

  // 5/3/1 standard percentages
  const schemes: Record<number, number[]> = {
    1: [0.65, 0.75, 0.85], // Week 1: 3x5
    2: [0.70, 0.80, 0.90], // Week 2: 3x3
    3: [0.75, 0.85, 0.95], // Week 3: 5/3/1
    4: [0.40, 0.50, 0.60], // Week 4: Deload
  };

  const reps: Record<number, string[]> = {
    1: ['5', '5', '5+'],
    2: ['3', '3', '3+'],
    3: ['5', '3', '1+'],
    4: ['5', '5', '5'],
  };

  const currentScheme = schemes[week] || schemes[1];
  const currentReps = reps[week] || reps[1];

  return currentScheme.map((pct, i) => ({
    percentage: Math.round(pct * 100),
    weight: Math.round((effectiveTM * pct) / 5) * 5, // Round to nearest 5lbs
    reps: currentReps[i],
  }));
};
