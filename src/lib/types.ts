export interface Lift {
  id: string;
  name: string;
  tm: number;
}

export interface WorkoutLog {
  date: string;
  lift: string;
  sets: number | string;
  volume: string;
  intensity?: number;
  rpe?: number | null;
}

export interface CalculatedPR {
  lift: string;
  est1RM: number;
  date: string;
}

export interface Profile {
  name: string;
  handle: string;
  theme: string;
  units: string;
  notifications: boolean;
}

export interface DailyReadiness {
  date: string;
  sleep_quality: number | null;
  stress_level: number | null;
  fatigue_level: number | null;
  overall_score: number | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // e.g., Lucide icon name or image path
  criteria: string; // Human-readable criteria
  earned?: boolean; // Whether the user has earned it
  earned_date?: string; // Date earned (ISO string)
}
