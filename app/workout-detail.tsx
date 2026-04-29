/**
 * Workout Detail Screen - View and edit individual workouts
 */

import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useFitness } from '@/lib/fitness-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Workout } from '@/lib/types';
import { PrimaryButton, SecondaryButton, EmptyState } from '@/components/ui/components';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { workouts, deleteWorkout } = useFitness();
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const found = workouts.find((w) => w.id === id);
    setWorkout(found || null);
  }, [id, workouts]);

  const handleDelete = () => {
    Alert.alert('Delete Workout', 'Are you sure you want to delete this workout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            if (workout) {
              await deleteWorkout(workout.id);
              if (Platform.OS !== 'web') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              router.back();
            }
          } catch (error) {
            alert('Failed to delete workout');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (!workout) {
    return (
      <ScreenContainer>
        <EmptyState icon="🔍" title="Workout not found" message="This workout no longer exists." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">Workout Details</Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-2xl">✕</Text>
            </Pressable>
          </View>

          {/* Workout Type */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-muted text-sm mb-2">Type</Text>
            <Text className="text-2xl font-bold text-foreground capitalize">{workout.type}</Text>
          </View>

          {/* Date and Time */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-muted text-sm mb-2">Date</Text>
            <Text className="text-lg font-semibold text-foreground">
              {new Date(workout.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Stats Grid */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-muted text-sm mb-2">Duration</Text>
                <Text className="text-2xl font-bold text-foreground">{workout.duration}</Text>
                <Text className="text-muted text-xs">minutes</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-muted text-sm mb-2">Calories</Text>
                <Text className="text-2xl font-bold text-foreground">{workout.calories}</Text>
                <Text className="text-muted text-xs">kcal</Text>
              </View>
            </View>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-muted text-sm mb-2">Intensity</Text>
              <Text className="text-lg font-semibold text-foreground capitalize">
                {workout.intensity}
              </Text>
            </View>
          </View>

          {/* Notes */}
          {workout.notes && (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-muted text-sm mb-2">Notes</Text>
              <Text className="text-foreground">{workout.notes}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <PrimaryButton
              onPress={() => {
                // Edit functionality can be added later
                alert('Edit functionality coming soon!');
              }}
              label="Edit Workout"
            />
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View className="border border-error px-6 py-3 rounded-full items-center justify-center">
                <Text className="text-error font-semibold text-base">Delete Workout</Text>
              </View>
            </Pressable>
            <SecondaryButton onPress={() => router.back()} label="Back" />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
