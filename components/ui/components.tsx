/**
 * Reusable UI Components for Fitness Tracker
 */

import React from 'react';
import { View, Text, Pressable, TextInput, ScrollView, FlatList } from 'react-native';
import { cn } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Primary Button Component
 */
export function PrimaryButton({
  onPress,
  label,
  disabled = false,
  className = '',
}: {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const colors = useColors();

  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed && !disabled ? 0.97 : 1 }],
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
      ]}
    >
      <View
        className={cn(
          'bg-primary px-6 py-3 rounded-full items-center justify-center',
          disabled && 'opacity-50',
          className
        )}
      >
        <Text className="text-background font-semibold text-base">{label}</Text>
      </View>
    </Pressable>
  );
}

/**
 * Secondary Button Component
 */
export function SecondaryButton({
  onPress,
  label,
  disabled = false,
  className = '',
}: {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const colors = useColors();

  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        className={cn(
          'border border-border px-6 py-3 rounded-full items-center justify-center',
          disabled && 'opacity-50',
          className
        )}
      >
        <Text className="text-foreground font-semibold text-base">{label}</Text>
      </View>
    </Pressable>
  );
}

/**
 * Stat Card Component
 */
export function StatCard({
  label,
  value,
  unit = '',
  icon = null,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}) {
  return (
    <View className="bg-surface rounded-lg p-4 border border-border">
      <Text className="text-muted text-sm mb-2">{label}</Text>
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-2xl font-bold text-foreground">
          {value}
          {unit && <Text className="text-base font-normal ml-1">{unit}</Text>}
        </Text>
      </View>
    </View>
  );
}

/**
 * Workout Type Selector Component
 */
export function WorkoutTypeSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (type: string) => void;
}) {
  const types = [
    { id: 'running', label: 'Running' },
    { id: 'cycling', label: 'Cycling' },
    { id: 'strength', label: 'Strength' },
    { id: 'yoga', label: 'Yoga' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <View className="gap-2">
      <Text className="text-foreground font-semibold mb-2">Workout Type</Text>
      <View className="flex-row flex-wrap gap-2">
        {types.map((type) => (
          <Pressable
            key={type.id}
            onPress={() => onSelect(type.id)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View
              className={cn(
                'px-4 py-2 rounded-full border',
                selected === type.id
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              )}
            >
              <Text
                className={cn(
                  'font-medium',
                  selected === type.id ? 'text-background' : 'text-foreground'
                )}
              >
                {type.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/**
 * Intensity Selector Component
 */
export function IntensitySelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (intensity: string) => void;
}) {
  const intensities = [
    { id: 'light', label: 'Light' },
    { id: 'moderate', label: 'Moderate' },
    { id: 'high', label: 'High' },
  ];

  return (
    <View className="gap-2">
      <Text className="text-foreground font-semibold mb-2">Intensity</Text>
      <View className="flex-row gap-2">
        {intensities.map((intensity) => (
          <Pressable
            key={intensity.id}
            onPress={() => onSelect(intensity.id)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="flex-1"
          >
            <View
              className={cn(
                'px-4 py-2 rounded-lg border items-center',
                selected === intensity.id
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              )}
            >
              <Text
                className={cn(
                  'font-medium',
                  selected === intensity.id ? 'text-background' : 'text-foreground'
                )}
              >
                {intensity.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/**
 * Rating Selector Component (for mood, energy, motivation)
 */
export function RatingSelector({
  label,
  value,
  onSelect,
  maxRating = 5,
}: {
  label: string;
  value: number;
  onSelect: (rating: number) => void;
  maxRating?: number;
}) {
  return (
    <View className="gap-3">
      <Text className="text-foreground font-semibold">{label}</Text>
      <View className="flex-row gap-2 justify-center">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
          <Pressable
            key={rating}
            onPress={() => onSelect(rating)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View
              className={cn(
                'w-12 h-12 rounded-full items-center justify-center border-2',
                value === rating
                  ? 'bg-primary border-primary'
                  : 'bg-surface border-border'
              )}
            >
              <Text
                className={cn(
                  'font-bold text-lg',
                  value === rating ? 'text-background' : 'text-foreground'
                )}
              >
                {rating}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/**
 * Input Field Component
 */
export function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address';
  multiline?: boolean;
  numberOfLines?: number;
}) {
  const colors = useColors();

  return (
    <View className="gap-2">
      <Text className="text-foreground font-semibold">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={cn(
          'border border-border rounded-lg px-4 py-3 text-foreground',
          multiline && 'text-top'
        )}
        style={{
          color: colors.foreground,
          borderColor: colors.border,
        }}
      />
    </View>
  );
}

/**
 * Workout List Item Component
 */
export function WorkoutListItem({
  workout,
  onPress,
  onDelete,
}: {
  workout: any;
  onPress: () => void;
  onDelete: () => void;
}) {
  const getWorkoutEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      running: '🏃',
      cycling: '🚴',
      strength: '💪',
      yoga: '🧘',
      other: '⚡',
    };
    return emojis[type] || '⚡';
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-lg p-4 border border-border mb-3 flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-2xl">{getWorkoutEmoji(workout.type)}</Text>
            <Text className="text-foreground font-semibold flex-1">
              {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
            </Text>
            <Text className="text-muted text-sm">{workout.date}</Text>
          </View>
          <View className="flex-row gap-4">
            <Text className="text-muted text-sm">{workout.duration} min</Text>
            <Text className="text-muted text-sm">{workout.calories} cal</Text>
            <Text className="text-muted text-sm capitalize">{workout.intensity}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Empty State Component
 */
export function EmptyState({
  icon = '📋',
  title,
  message,
}: {
  icon?: string;
  title: string;
  message: string;
}) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-xl font-bold text-foreground mb-2">{title}</Text>
      <Text className="text-muted text-center px-4">{message}</Text>
    </View>
  );
}

/**
 * Loading Spinner Component
 */
export function LoadingSpinner() {
  const colors = useColors();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl">⏳</Text>
      <Text className="text-muted mt-2">Loading...</Text>
    </View>
  );
}
