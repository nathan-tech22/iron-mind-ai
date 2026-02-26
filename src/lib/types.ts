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
  sleep_quality: number;
  stress_level: number;
  fatigue_level: number;
  overall_score: number;
}

export interface CalculatedPR {
  lift: string;
  est1RM: number;
  date: string;
}
