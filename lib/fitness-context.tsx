/**
 * Fitness Tracker Context - Global state management
 * Manages workouts, check-ins, and app settings
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Workout, CheckIn, AppSettings, DailyStats, WeeklyStats } from './types';
import * as Storage from './storage';

interface FitnessState {
  workouts: Workout[];
  checkIns: CheckIn[];
  settings: AppSettings;
  loading: boolean;
  error: string | null;
}

type FitnessAction =
  | { type: 'SET_WORKOUTS'; payload: Workout[] }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'UPDATE_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'SET_CHECKINS'; payload: CheckIn[] }
  | { type: 'ADD_CHECKIN'; payload: CheckIn }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface FitnessContextType extends FitnessState {
  addWorkout: (workout: Workout) => Promise<void>;
  updateWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  addCheckIn: (checkIn: CheckIn) => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  getTodayStats: () => DailyStats;
  getWeeklyStats: (startDate: string) => WeeklyStats;
  getStreak: () => number;
  loadData: () => Promise<void>;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

const initialState: FitnessState = {
  workouts: [],
  checkIns: [],
  settings: {
    theme: 'auto',
    units: 'metric',
    notificationsEnabled: true,
  },
  loading: true,
  error: null,
};

function fitnessReducer(state: FitnessState, action: FitnessAction): FitnessState {
  switch (action.type) {
    case 'SET_WORKOUTS':
      return { ...state, workouts: action.payload };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [...state.workouts, action.payload] };
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.payload.id ? action.payload : w
        ),
      };
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.payload),
      };
    case 'SET_CHECKINS':
      return { ...state, checkIns: action.payload };
    case 'ADD_CHECKIN':
      return {
        ...state,
        checkIns: state.checkIns.filter((c) => c.date !== action.payload.date).concat(action.payload),
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function FitnessProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fitnessReducer, initialState);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [workouts, checkIns, settings] = await Promise.all([
        Storage.getWorkouts(),
        Storage.getCheckIns(),
        Storage.getSettings(),
      ]);
      dispatch({ type: 'SET_WORKOUTS', payload: workouts });
      dispatch({ type: 'SET_CHECKINS', payload: checkIns });
      dispatch({ type: 'SET_SETTINGS', payload: settings });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  async function addWorkout(workout: Workout) {
    try {
      await Storage.saveWorkout(workout);
      dispatch({ type: 'ADD_WORKOUT', payload: workout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save workout' });
      throw error;
    }
  }

  async function updateWorkout(workout: Workout) {
    try {
      await Storage.saveWorkout(workout);
      dispatch({ type: 'UPDATE_WORKOUT', payload: workout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update workout' });
      throw error;
    }
  }

  async function deleteWorkout(id: string) {
    try {
      await Storage.deleteWorkout(id);
      dispatch({ type: 'DELETE_WORKOUT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete workout' });
      throw error;
    }
  }

  async function addCheckIn(checkIn: CheckIn) {
    try {
      await Storage.saveCheckIn(checkIn);
      dispatch({ type: 'ADD_CHECKIN', payload: checkIn });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save check-in' });
      throw error;
    }
  }

  async function updateSettings(settings: AppSettings) {
    try {
      await Storage.saveSettings(settings);
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save settings' });
      throw error;
    }
  }

  function getTodayStats(): DailyStats {
    const today = new Date().toISOString().split('T')[0];
    const todayWorkouts = state.workouts.filter((w) => w.date === today);
    const todayCheckIn = state.checkIns.find((c) => c.date === today);

    return {
      date: today,
      totalWorkouts: todayWorkouts.length,
      totalCalories: todayWorkouts.reduce((sum, w) => sum + w.calories, 0),
      totalDuration: todayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      workouts: todayWorkouts,
      checkIn: todayCheckIn,
    };
  }

  function getWeeklyStats(startDate: string): WeeklyStats {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    const weekWorkouts = state.workouts.filter(
      (w) => w.date >= startDateStr && w.date <= endDateStr
    );

    const dailyStats: DailyStats[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayWorkouts = weekWorkouts.filter((w) => w.date === dateStr);
      const dayCheckIn = state.checkIns.find((c) => c.date === dateStr);

      dailyStats.push({
        date: dateStr,
        totalWorkouts: dayWorkouts.length,
        totalCalories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
        totalDuration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
        workouts: dayWorkouts,
        checkIn: dayCheckIn,
      });
    }

    return {
      startDate: startDateStr,
      endDate: endDateStr,
      totalWorkouts: weekWorkouts.length,
      totalCalories: weekWorkouts.reduce((sum, w) => sum + w.calories, 0),
      averageDuration:
        weekWorkouts.length > 0
          ? Math.round(weekWorkouts.reduce((sum, w) => sum + w.duration, 0) / weekWorkouts.length)
          : 0,
      streak: getStreak(),
      dailyStats,
    };
  }

  function getStreak(): number {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasActivity = state.workouts.some((w) => w.date === dateStr);

      if (!hasActivity) break;

      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  const value: FitnessContextType = {
    ...state,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addCheckIn,
    updateSettings,
    getTodayStats,
    getWeeklyStats,
    getStreak,
    loadData,
  };

  return (
    <FitnessContext.Provider value={value}>
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}
