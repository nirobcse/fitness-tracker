/**
 * Progress Screen - View statistics and progress tracking
 */

import { ScrollView, View, Text } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useFitness } from '@/lib/fitness-context';
import { StatCard, EmptyState, LoadingSpinner } from '@/components/ui/components';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function ProgressScreen() {
  const { getWeeklyStats, getStreak, workouts, loading } = useFitness();
  const [weeklyStats, setWeeklyStats] = useState(getWeeklyStats(getStartOfWeek()));
  const [streak, setStreak] = useState(getStreak());

  useFocusEffect(
    useCallback(() => {
      setWeeklyStats(getWeeklyStats(getStartOfWeek()));
      setStreak(getStreak());
    }, [getWeeklyStats, getStreak])
  );

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingSpinner />
      </ScreenContainer>
    );
  }

  if (workouts.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="📊"
          title="No data yet"
          message="Start logging workouts to see your progress and statistics."
        />
      </ScreenContainer>
    );
  }

  const totalAllTime = workouts.reduce((sum, w) => sum + w.calories, 0);
  const avgDurationAllTime =
    workouts.length > 0
      ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length)
      : 0;

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Your Progress</Text>
            <Text className="text-muted">Track your fitness journey</Text>
          </View>

          {/* Streak */}
          <View className="bg-primary rounded-lg p-6 items-center justify-center">
            <Text className="text-5xl font-bold text-background mb-2">{streak}</Text>
            <Text className="text-background font-semibold">Day Streak 🔥</Text>
            <Text className="text-background text-sm mt-1">Keep it up!</Text>
          </View>

          {/* This Week Stats */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">This Week</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  label="Workouts"
                  value={weeklyStats.totalWorkouts}
                  icon={<Text className="text-2xl">🏋️</Text>}
                />
              </View>
              <View className="flex-1">
                <StatCard
                  label="Calories"
                  value={weeklyStats.totalCalories}
                  unit="kcal"
                  icon={<Text className="text-2xl">🔥</Text>}
                />
              </View>
            </View>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-muted text-sm mb-2">Avg Duration</Text>
              <Text className="text-2xl font-bold text-foreground">
                {weeklyStats.averageDuration}
                <Text className="text-base font-normal ml-1">min</Text>
              </Text>
            </View>
          </View>

          {/* All Time Stats */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">All Time</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  label="Total Workouts"
                  value={workouts.length}
                  icon={<Text className="text-2xl">📊</Text>}
                />
              </View>
              <View className="flex-1">
                <StatCard
                  label="Total Calories"
                  value={totalAllTime}
                  unit="kcal"
                  icon={<Text className="text-2xl">🔥</Text>}
                />
              </View>
            </View>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-muted text-sm mb-2">Avg Workout Duration</Text>
              <Text className="text-2xl font-bold text-foreground">
                {avgDurationAllTime}
                <Text className="text-base font-normal ml-1">min</Text>
              </Text>
            </View>
          </View>

          {/* Workout Type Breakdown */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Workout Types</Text>
            <WorkoutTypeBreakdown workouts={workouts} />
          </View>

          {/* Daily Activity Chart */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Weekly Activity</Text>
            <WeeklyActivityChart dailyStats={weeklyStats.dailyStats} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function WorkoutTypeBreakdown({ workouts }: { workouts: any[] }) {
  const types = ['running', 'cycling', 'strength', 'yoga', 'other'];
  const breakdown = types.map((type) => ({
    type,
    count: workouts.filter((w) => w.type === type).length,
  }));

  return (
    <View className="gap-2">
      {breakdown
        .filter((item) => item.count > 0)
        .map((item) => (
          <View key={item.type} className="bg-surface rounded-lg p-3 border border-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-foreground font-medium capitalize">{item.type}</Text>
              <View className="flex-row items-center gap-2">
                <View className="bg-primary rounded-full px-3 py-1">
                  <Text className="text-background font-semibold text-sm">{item.count}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
}

function WeeklyActivityChart({ dailyStats }: { dailyStats: any[] }) {
  const maxWorkouts = Math.max(...dailyStats.map((d) => d.totalWorkouts), 1);

  return (
    <View className="gap-3">
      {dailyStats.map((day, index) => {
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const percentage = (day.totalWorkouts / maxWorkouts) * 100;

        return (
          <View key={index} className="gap-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted text-sm w-8">{dayName}</Text>
              <View className="flex-1 mx-2 bg-surface rounded-full h-6 overflow-hidden">
                <View
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </View>
              <Text className="text-foreground font-semibold text-sm w-8 text-right">
                {day.totalWorkouts}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function getStartOfWeek(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const startDate = new Date(today.setDate(diff));
  return startDate.toISOString().split('T')[0];
}
