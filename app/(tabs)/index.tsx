/**
 * Home Screen - Daily Summary and Quick Actions
 */

import { ScrollView, View, Text, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useFitness } from '@/lib/fitness-context';
import { StatCard, PrimaryButton, EmptyState, LoadingSpinner } from '@/components/ui/components';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const router = useRouter();
  const { getTodayStats, workouts, loading } = useFitness();
  const [todayStats, setTodayStats] = useState(getTodayStats());

  useFocusEffect(
    useCallback(() => {
      setTodayStats(getTodayStats());
    }, [getTodayStats])
  );

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingSpinner />
      </ScreenContainer>
    );
  }

  const handleLogWorkout = () => {
    router.push('/log-workout');
  };

  const handleCheckIn = () => {
    router.push('/check-in');
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Today's Activity</Text>
            <Text className="text-muted">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Stats Grid */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  label="Workouts"
                  value={todayStats.totalWorkouts}
                  icon={<Text className="text-2xl">🏋️</Text>}
                />
              </View>
              <View className="flex-1">
                <StatCard
                  label="Calories"
                  value={todayStats.totalCalories}
                  unit="kcal"
                  icon={<Text className="text-2xl">🔥</Text>}
                />
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  label="Duration"
                  value={todayStats.totalDuration}
                  unit="min"
                  icon={<Text className="text-2xl">⏱️</Text>}
                />
              </View>
              <View className="flex-1">
                <StatCard
                  label="Mood"
                  value={todayStats.checkIn ? '✅' : '—'}
                  icon={<Text className="text-2xl">😊</Text>}
                />
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <PrimaryButton onPress={handleLogWorkout} label="📝 Log Workout" />
            <PrimaryButton onPress={handleCheckIn} label="😊 Check-in" />
          </View>

          {/* Recent Workouts */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Recent Workouts</Text>
            {todayStats.workouts.length > 0 ? (
              <View className="gap-2">
                {todayStats.workouts.map((workout) => (
                  <Pressable
                    key={workout.id}
                    onPress={() =>
                      router.push({
                        pathname: '/workout-detail',
                        params: { id: workout.id },
                      })
                    }
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <View className="bg-surface rounded-lg p-4 border border-border">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-foreground font-semibold capitalize">
                          {workout.type}
                        </Text>
                        <Text className="text-muted text-sm">{workout.date}</Text>
                      </View>
                      <View className="flex-row gap-4">
                        <Text className="text-muted text-sm">{workout.duration} min</Text>
                        <Text className="text-muted text-sm">{workout.calories} cal</Text>
                        <Text className="text-muted text-sm capitalize">{workout.intensity}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-muted text-center">No workouts logged today</Text>
              </View>
            )}
          </View>

          {/* Check-in Status */}
          {todayStats.checkIn && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-2">
              <Text className="text-foreground font-semibold">Today's Check-in</Text>
              <View className="flex-row gap-4">
                <View className="flex-1 items-center">
                  <Text className="text-muted text-xs mb-1">Mood</Text>
                  <Text className="text-2xl">{todayStats.checkIn.mood}/5</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-muted text-xs mb-1">Energy</Text>
                  <Text className="text-2xl">{todayStats.checkIn.energy}/5</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-muted text-xs mb-1">Motivation</Text>
                  <Text className="text-2xl">{todayStats.checkIn.motivation}/5</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
