import { estimate1RM } from './iron-logic';

/**
 * AI Coaching Engine v1.0
 * Analyzes training history and current training maxes to suggest optimizations.
 */
export const analyzeProgress = (history: any[], lifts: any[]) => {
  const insights: any[] = [];

  lifts.forEach(lift => {
    // Filter history for this specific lift
    const liftLogs = history.filter(h => h.lift === lift.name);
    if (liftLogs.length === 0) return;

    // Find the best estimated 1RM from history
    const bestLog = liftLogs.reduce((prev, curr) => {
      const pVol = parseFloat(prev.volume.replace(/,/g, ''));
      const cVol = parseFloat(curr.volume.replace(/,/g, ''));
      const pEst = estimate1RM.epley(pVol / prev.sets, 5); // Rough avg for now
      const cEst = estimate1RM.epley(cVol / curr.sets, 5);
      return (cEst > pEst) ? curr : prev;
    });

    const currentBestWeight = parseFloat(bestLog.volume.replace(/,/g, '')) / bestLog.sets;
    const est1RM = estimate1RM.epley(currentBestWeight, 5);

    // AI INSIGHT: If estimated 1RM is > 20% higher than Training Max, suggest a leap
    if (est1RM > lift.tm * 1.20) {
      insights.push({
        type: 'LEAP',
        lift: lift.name,
        message: `Your output on ${lift.name} suggests your Training Max is too low. Consider a jump to ${Math.round((lift.tm + 15)/5)*5} lbs.`,
        actionable: true
      });
    }
    
    // AI INSIGHT: Consistency Check
    if (liftLogs.length > 3) {
      insights.push({
        type: 'STREAK',
        lift: lift.name,
        message: `Consistency on ${lift.name} is elite. Momentum is building.`,
        actionable: false
      });
    }
  });

  return insights;
};
