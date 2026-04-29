/**
 * Storage service for managing workouts and check-ins
 * Uses AsyncStorage for local persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, CheckIn, AppSettings } from './types';

const WORKOUTS_KEY = '@fitness_tracker_workouts';
const CHECKINS_KEY = '@fitness_tracker_checkins';
const SETTINGS_KEY = '@fitness_tracker_settings';

/**
 * Workouts Storage
 */
export async function getWorkouts(): Promise<Workout[]> {
  try {
    const data = await AsyncStorage.getItem(WORKOUTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading workouts:', error);
    return [];
  }
}

export async function saveWorkout(workout: Workout): Promise<void> {
  try {
    const workouts = await getWorkouts();
    const index = workouts.findIndex((w) => w.id === workout.id);
    if (index >= 0) {
      workouts[index] = workout;
    } else {
      workouts.push(workout);
    }
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
}

export async function deleteWorkout(id: string): Promise<void> {
  try {
    const workouts = await getWorkouts();
    const filtered = workouts.filter((w) => w.id !== id);
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
}

export async function getWorkoutsByDate(date: string): Promise<Workout[]> {
  try {
    const workouts = await getWorkouts();
    return workouts.filter((w) => w.date === date);
  } catch (error) {
    console.error('Error loading workouts by date:', error);
    return [];
  }
}

export async function getWorkoutsByDateRange(
  startDate: string,
  endDate: string
): Promise<Workout[]> {
  try {
    const workouts = await getWorkouts();
    return workouts.filter((w) => w.date >= startDate && w.date <= endDate);
  } catch (error) {
    console.error('Error loading workouts by date range:', error);
    return [];
  }
}

/**
 * Check-ins Storage
 */
export async function getCheckIns(): Promise<CheckIn[]> {
  try {
    const data = await AsyncStorage.getItem(CHECKINS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading check-ins:', error);
    return [];
  }
}

export async function saveCheckIn(checkIn: CheckIn): Promise<void> {
  try {
    const checkIns = await getCheckIns();
    const index = checkIns.findIndex((c) => c.id === checkIn.id);
    if (index >= 0) {
      checkIns[index] = checkIn;
    } else {
      checkIns.push(checkIn);
    }
    await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
  } catch (error) {
    console.error('Error saving check-in:', error);
    throw error;
  }
}

export async function getCheckInByDate(date: string): Promise<CheckIn | null> {
  try {
    const checkIns = await getCheckIns();
    return checkIns.find((c) => c.date === date) || null;
  } catch (error) {
    console.error('Error loading check-in by date:', error);
    return null;
  }
}

export async function getCheckInsByDateRange(
  startDate: string,
  endDate: string
): Promise<CheckIn[]> {
  try {
    const checkIns = await getCheckIns();
    return checkIns.filter((c) => c.date >= startDate && c.date <= endDate);
  } catch (error) {
    console.error('Error loading check-ins by date range:', error);
    return [];
  }
}

/**
 * Settings Storage
 */
export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data
      ? JSON.parse(data)
      : {
          theme: 'auto',
          units: 'metric',
          notificationsEnabled: true,
        };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      theme: 'auto',
      units: 'metric',
      notificationsEnabled: true,
    };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

/**
 * Utility functions
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([WORKOUTS_KEY, CHECKINS_KEY, SETTINGS_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}
