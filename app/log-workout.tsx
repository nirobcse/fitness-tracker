/**
 * Workout Logger Screen - Log a new workout
 */

import { ScrollView, View, Text, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import {
  WorkoutTypeSelector,
  IntensitySelector,
  InputField,
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/components';
import { useFitness } from '@/lib/fitness-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { calculateCalories, WorkoutType, Intensity } from '@/lib/types';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function LogWorkoutScreen() {
  const router = useRouter();
  const { addWorkout } = useFitness();

  const [workoutType, setWorkoutType] = useState<WorkoutType>('running');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState<Intensity>('moderate');
  const [calories, setCalories] = useState(
    String(calculateCalories(workoutType, parseInt(duration) || 0, intensity))
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDurationChange = (text: string) => {
    setDuration(text);
    const calculatedCalories = calculateCalories(
      workoutType,
      parseInt(text) || 0,
      intensity
    );
    setCalories(String(calculatedCalories));
  };

  const handleIntensityChange = (newIntensity: string) => {
    const intensityValue = newIntensity as Intensity;
    setIntensity(intensityValue);
    const calculatedCalories = calculateCalories(
      workoutType,
      parseInt(duration) || 0,
      intensityValue
    );
    setCalories(String(calculatedCalories));
  };

  const handleWorkoutTypeChange = (type: string) => {
    setWorkoutType(type as WorkoutType);
    const calculatedCalories = calculateCalories(
      type as WorkoutType,
      parseInt(duration) || 0,
      intensity
    );
    setCalories(String(calculatedCalories));
  };

  const handleSave = async () => {
    if (!duration || parseInt(duration) <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const workout = {
        id: Date.now().toString(),
        date: today,
        timestamp: Date.now(),
        type: workoutType,
        duration: parseInt(duration),
        intensity,
        calories: parseInt(calories),
        notes: notes || undefined,
      };

      await addWorkout(workout);

      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.back();
    } catch (error) {
      alert('Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">Log Workout</Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-2xl">✕</Text>
            </Pressable>
          </View>

          {/* Workout Type */}
          <WorkoutTypeSelector selected={workoutType} onSelect={handleWorkoutTypeChange} />

          {/* Duration */}
          <InputField
            label="Duration (minutes)"
            placeholder="30"
            value={duration}
            onChangeText={handleDurationChange}
            keyboardType="numeric"
          />

          {/* Intensity */}
          <IntensitySelector selected={intensity} onSelect={(value) => handleIntensityChange(value)} />

          {/* Calories */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-muted text-sm mb-2">Estimated Calories</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-3xl font-bold text-foreground">{calories}</Text>
              <Text className="text-muted">kcal</Text>
            </View>
            <Text className="text-muted text-xs mt-2">
              Based on {workoutType}, {duration} min, {intensity} intensity
            </Text>
          </View>

          {/* Notes */}
          <InputField
            label="Notes (optional)"
            placeholder="How did the workout feel?"
            value={notes}
            onChangeText={setNotes}
            multiline={true}
            numberOfLines={3}
          />

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <PrimaryButton
              onPress={handleSave}
              label="Save Workout"
              disabled={loading}
            />
            <SecondaryButton
              onPress={() => router.back()}
              label="Cancel"
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
