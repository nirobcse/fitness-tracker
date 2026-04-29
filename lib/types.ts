/**
 * Data models and types for the Fitness Tracker app
 */

export type WorkoutType = 'running' | 'cycling' | 'strength' | 'yoga' | 'other';
export type Intensity = 'light' | 'moderate' | 'high';

export interface Workout {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timestamp: number; // Unix timestamp
  type: WorkoutType;
  duration: number; // minutes
  intensity: Intensity;
  calories: number;
  notes?: string;
}

export interface CheckIn {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timestamp: number; // Unix timestamp
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  motivation: number; // 1-5 scale
  notes?: string;
}

export interface DailyStats {
  date: string;
  totalWorkouts: number;
  totalCalories: number;
  totalDuration: number;
  workouts: Workout[];
  checkIn?: CheckIn;
}

export interface WeeklyStats {
  startDate: string;
  endDate: string;
  totalWorkouts: number;
  totalCalories: number;
  averageDuration: number;
  streak: number; // consecutive days with activity
  dailyStats: DailyStats[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  units: 'metric' | 'imperial';
  notificationsEnabled: boolean;
}

/**
 * Calorie calculation based on workout type, duration, and intensity
 * These are rough estimates for a 70kg person
 */
export const CALORIE_MULTIPLIERS: Record<WorkoutType, Record<Intensity, number>> = {
  running: {
    light: 8, // ~480 cal/hour
    moderate: 12, // ~720 cal/hour
    high: 16, // ~960 cal/hour
  },
  cycling: {
    light: 6, // ~360 cal/hour
    moderate: 10, // ~600 cal/hour
    high: 14, // ~840 cal/hour
  },
  strength: {
    light: 5, // ~300 cal/hour
    moderate: 8, // ~480 cal/hour
    high: 12, // ~720 cal/hour
  },
  yoga: {
    light: 3, // ~180 cal/hour
    moderate: 5, // ~300 cal/hour
    high: 7, // ~420 cal/hour
  },
  other: {
    light: 4, // ~240 cal/hour
    moderate: 7, // ~420 cal/hour
    high: 10, // ~600 cal/hour
  },
};

export function calculateCalories(
  type: WorkoutType,
  duration: number,
  intensity: Intensity
): number {
  const multiplier = CALORIE_MULTIPLIERS[type][intensity];
  return Math.round((multiplier * duration) / 60);
}

export function getWorkoutTypeLabel(type: WorkoutType): string {
  const labels: Record<WorkoutType, string> = {
    running: 'Running',
    cycling: 'Cycling',
    strength: 'Strength',
    yoga: 'Yoga',
    other: 'Other',
  };
  return labels[type];
}

export function getIntensityLabel(intensity: Intensity): string {
  const labels: Record<Intensity, string> = {
    light: 'Light',
    moderate: 'Moderate',
    high: 'High',
  };
  return labels[intensity];
}

export function getMoodLabel(mood: number): string {
  const labels: Record<number, string> = {
    1: 'Very Bad',
    2: 'Bad',
    3: 'Okay',
    4: 'Good',
    5: 'Very Good',
  };
  return labels[mood] || 'Unknown';
}
