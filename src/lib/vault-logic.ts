import { supabase } from './supabase';

/**
 * Iron Vault v1.0
 * Handles offline persistence and background synchronization.
 */
const VAULT_KEY = 'iron-mind-vault-pending';

export const ironVault = {
  /**
   * Queue a workout for sync
   */
  queueWorkout: (workout: any) => {
    const pending = JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
    pending.push({
      ...workout,
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID()
    });
    localStorage.setItem(VAULT_KEY, JSON.stringify(pending));
  },

  /**
   * Attempt to sync all pending items
   */
  sync: async () => {
    const pending = JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
    if (pending.length === 0) return { success: true, count: 0 };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id === 'demo-user') return { success: false, reason: 'unauthorized' };

      const successfulIds: string[] = [];

      for (const item of pending) {
        const { error } = await supabase.from('workouts').insert({
          user_id: user.id,
          lift_id: item.lift_id,
          weight_used: item.weight_used,
          reps_completed: item.reps_completed,
          workout_date: item.workout_date || item.timestamp
        });

        if (!error) {
          successfulIds.push(item.id);
        }
      }

      const remaining = pending.filter((item: any) => !successfulIds.includes(item.id));
      localStorage.setItem(VAULT_KEY, JSON.stringify(remaining));

      return { 
        success: true, 
        count: successfulIds.length, 
        remaining: remaining.length 
      };
    } catch (e) {
      console.error('Vault sync failed:', e);
      return { success: false, error: e };
    }
  },

  getPendingCount: () => {
    return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]').length;
  }
};
