import { WorkoutLog } from './types';
import { estimate1RM } from './iron-logic';

/**
 * AI Coaching Engine v1.1
 * Analyzes training history and current training maxes to suggest optimizations.
 */
export const analyzeProgress = (history: WorkoutLog[], lifts: any[]) => {
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
        message: `Recent ${lift.name} sessions are slowing down. Performance is below 85% of your Training Max.`,
        actionable: true,
        actionType: 'RESET_TM',
        suggestedTM: Math.round((lift.tm * 0.9) / 5) * 5
      });
    }
    
    // AI INSIGHT: RPE-based Adjustment (New v1.2)
    const mostRecentRPE = liftLogs[0]?.rpe;
    if (mostRecentRPE !== undefined && mostRecentRPE !== null) {
      if (mostRecentRPE <= 6 && liftLogs.length > 2 && bestEst > lift.tm * 1.05) { // Very low RPE for a strong performance
        insights.push({
          type: 'RPE_LOW',
          lift: lift.name,
          message: `Your last ${lift.name} session felt too easy (RPE ${mostRecentRPE}). Consider a +5lb TM increase. The engine has more capacity.`,
          actionable: true,
          actionType: 'RESET_TM',
          suggestedTM: Math.round((lift.tm + 5) / 5) * 5
        });
      } else if (mostRecentRPE >= 9 && liftLogs.length > 2 && bestEst < lift.tm * 0.95) { // Very high RPE for a weaker performance
        insights.push({
          type: 'RPE_HIGH',
          lift: lift.name,
          message: `Last ${lift.name} session was a grinder (RPE ${mostRecentRPE}). You might be fatigued. Consider an adaptive TM reset.`,
          actionable: true,
          actionType: 'RESET_TM',
          suggestedTM: Math.round((lift.tm * 0.9) / 5) * 5
        });
      }
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

    // NEW AI INSIGHT: Multi-Cycle Trend Engine (Phase 17)
    // Compare most recent session to 4 sessions ago (one full cycle back)
    if (liftLogs.length >= 5) {
      const currentSession = liftLogs[0];
      const previousCycleSession = liftLogs[4];

      const currentEst = estimate1RM.epley(parseFloat(String(currentSession.volume || '0').replace(/,/g, '')) / (parseInt(currentSession.sets) || 1), 5);
      const prevEst = estimate1RM.epley(parseFloat(String(previousCycleSession.volume || '0').replace(/,/g, '')) / (parseInt(previousCycleSession.sets) || 1), 5);

      const diff = currentEst - prevEst;
      const pct = ((diff / prevEst) * 100).toFixed(1);

      if (diff > 0) {
        insights.push({
          type: 'TREND_UP',
          lift: lift.name,
          message: `Cycle-over-Cycle growth on ${lift.name}: +${pct}% (+${Math.round(diff)} lbs). The engine is accelerating.`,
          actionable: false
        });
      } else if (diff < -5) {
        insights.push({
          type: 'TREND_DOWN',
          lift: lift.name,
          message: `Velocity on ${lift.name} has dipped ${Math.abs(Number(pct))}% vs last cycle. Audit your sleep and recovery.`,
          actionable: false
        });
      }
    }

    // Tactical Form Cues
    const formCues: Record<string, string[]> = {
      'SQUAT': [
        "Drive your upper back into the bar. Keep the chest proud.",
        "Brace your core like you're about to take a punch.",
        "Root your big toe and heel into the floor. Spread the floor."
      ],
      'BENCH': [
        "Leg drive is active. Push your heels into the floor.",
        "Bend the bar. Engage your lats before the descent.",
        "Control the eccentric. Touch the same spot every rep."
      ],
      'DEADLIFT': [
        "Pull the slack out of the bar before you move.",
        "Push the floor away. Don't pull the bar up.",
        "Legs do the work, back just holds the line."
      ],
      'PRESS': [
        "Squeeze your glutes and quads. Build a rigid foundation.",
        "Punch through the ceiling. Head forward at the top.",
        "Keep the elbows slightly tucked. Vertical forearms."
      ]
    };

    const cues = formCues[lift.name?.toUpperCase()];
    if (cues) {
      const cue = cues[new Date().getDay() % cues.length];
      insights.push({
        type: 'FORM',
        lift: lift.name,
        message: `TACTICAL: ${cue}`,
        actionable: false
      });
    }
  });

  return insights;
};
