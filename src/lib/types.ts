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

export interface CalculatedPR {
  lift: string;
  est1RM: number;
  date: string;
}
