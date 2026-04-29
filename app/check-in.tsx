/**
 * Check-in Screen - Daily mood, energy, and motivation tracking
 */

import { ScrollView, View, Text, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { RatingSelector, InputField, PrimaryButton, SecondaryButton } from '@/components/ui/components';
import { useFitness } from '@/lib/fitness-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function CheckInScreen() {
  const router = useRouter();
  const { addCheckIn } = useFitness();

  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const checkIn = {
        id: Date.now().toString(),
        date: today,
        timestamp: Date.now(),
        mood,
        energy,
        motivation,
        notes: notes || undefined,
      };

      await addCheckIn(checkIn);

      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.back();
    } catch (error) {
      alert('Failed to save check-in');
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
            <Text className="text-2xl font-bold text-foreground">Daily Check-in</Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-2xl">✕</Text>
            </Pressable>
          </View>

          {/* Date */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-muted text-sm mb-1">Date</Text>
            <Text className="text-lg font-semibold text-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Mood Rating */}
          <RatingSelector label="How's your mood?" value={mood} onSelect={setMood} />

          {/* Energy Rating */}
          <RatingSelector label="Energy level?" value={energy} onSelect={setEnergy} />

          {/* Motivation Rating */}
          <RatingSelector label="Motivation level?" value={motivation} onSelect={setMotivation} />

          {/* Notes */}
          <InputField
            label="Notes (optional)"
            placeholder="How are you feeling today?"
            value={notes}
            onChangeText={setNotes}
            multiline={true}
            numberOfLines={3}
          />

          {/* Summary */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-muted text-sm mb-3">Today's Summary</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-foreground">Mood</Text>
                <Text className="font-semibold text-foreground">{mood}/5</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-foreground">Energy</Text>
                <Text className="font-semibold text-foreground">{energy}/5</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-foreground">Motivation</Text>
                <Text className="font-semibold text-foreground">{motivation}/5</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <PrimaryButton onPress={handleSave} label="Save Check-in" disabled={loading} />
            <SecondaryButton onPress={() => router.back()} label="Cancel" disabled={loading} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
