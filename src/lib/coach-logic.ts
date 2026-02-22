import { estimate1RM } from './iron-logic';

/**
 * AI Coaching Engine v1.1
 * Analyzes training history and current training maxes to suggest optimizations.
 */
export const analyzeProgress = (history: any[], lifts: any[]) => {
  const insights: any[] = [];

  lifts.forEach(lift => {
    // History entries can have lift names as "SQUAT" or "Squat", unify them
    const liftLogs = history.filter(h => h.lift?.toUpperCase() === lift.name?.toUpperCase());
    if (liftLogs.length === 0) {
      insights.push({
        type: 'ROOKIE',
        lift: lift.name,
        message: `New cycle detected for ${lift.name}. Focus on crisp reps to establish your baseline.`,
        actionable: false
      });
      return;
    }

    // Get the most recent 3 sessions to analyze trend
    const recentLogs = liftLogs.slice(0, 3);
    
    // Find the best estimated 1RM from history for the "Leap" calculation
    const bestEst = liftLogs.reduce((max, log) => {
      // Data from Supabase/LocalStorage might have volume as "1,200" or raw numbers
      const volString = String(log.volume || '0').replace(/,/g, '');
      const sets = parseInt(log.sets) || 1;
      const avgWeight = parseFloat(volString) / sets;
      const est = estimate1RM.epley(avgWeight, 5);
      return (est > max) ? est : max;
    }, 0);

    // AI INSIGHT: Training Max vs Performance
    // If estimated 1RM is > 20% higher than current Training Max, suggest a leap
    if (bestEst > lift.tm * 1.20) {
      insights.push({
        type: 'LEAP',
        lift: lift.name,
        message: `Your actual output for ${lift.name} is dwarfing your Training Max. You're ready for a +15lb jump.`,
        actionable: true
      });
    } else if (bestEst < lift.tm * 0.85 && liftLogs.length > 2) {
      // AI INSIGHT: Stall/Fatigue Check
      insights.push({
        type: 'FATIGUE',
        lift: lift.name,
        message: `Recent ${lift.name} sessions are slowing down. Consider a deload or a 5% Training Max reset next cycle.`,
        actionable: false
      });
    }
    
    // AI INSIGHT: Consistency & Streaks
    if (liftLogs.length >= 5) {
      insights.push({
        type: 'ELITE',
        lift: lift.name,
        message: `5+ sessions logged for ${lift.name}. Your habit is becoming iron. Maintain the cadence.`,
        actionable: false
      });
    }
  });

  return insights;
};
