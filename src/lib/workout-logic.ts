export const calculateWorkout = (tm: number, week: number) => {
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
    weight: Math.round((tm * pct) / 5) * 5, // Round to nearest 5lbs
    reps: currentReps[i],
  }));
};
