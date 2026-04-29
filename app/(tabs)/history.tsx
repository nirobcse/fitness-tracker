/**
 * History Screen - Browse all logged workouts
 */

import { ScrollView, View, Text, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useFitness } from '@/lib/fitness-context';
import { WorkoutListItem, EmptyState, LoadingSpinner } from '@/components/ui/components';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Workout } from '@/lib/types';

export default function HistoryScreen() {
  const router = useRouter();
  const { workouts, loading } = useFitness();
  const [sortedWorkouts, setSortedWorkouts] = useState<Workout[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let filtered = [...workouts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (selectedFilter) {
        filtered = filtered.filter((w) => w.type === selectedFilter);
      }

      setSortedWorkouts(filtered);
    }, [workouts, selectedFilter])
  );

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingSpinner />
      </ScreenContainer>
    );
  }

  const workoutTypes = ['running', 'cycling', 'strength', 'yoga', 'other'];

  return (
    <ScreenContainer className="p-4">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">Workout History</Text>
          <Text className="text-muted">{sortedWorkouts.length} workouts logged</Text>
        </View>

        {/* Filter Buttons */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-muted">Filter by type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <FilterButton
              label="All"
              selected={selectedFilter === null}
              onPress={() => setSelectedFilter(null)}
            />
            {workoutTypes.map((type) => (
              <FilterButton
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                selected={selectedFilter === type}
                onPress={() => setSelectedFilter(type)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Workouts List */}
        {sortedWorkouts.length > 0 ? (
          <FlatList
            data={sortedWorkouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WorkoutListItem
                workout={item}
                onPress={() => {
                  // Navigate to workout detail
                  router.push({
                    pathname: '/workout-detail',
                    params: { id: item.id },
                  });
                }}
                onDelete={() => {
                  // Handle delete
                }}
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 8 }}
          />
        ) : (
          <EmptyState
            icon="📋"
            title="No workouts yet"
            message={
              selectedFilter
                ? `No ${selectedFilter} workouts logged. Start by logging your first workout!`
                : 'Start logging your workouts to see them here.'
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

function FilterButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <View
      className={`px-4 py-2 rounded-full border ${
        selected ? 'bg-primary border-primary' : 'bg-surface border-border'
      }`}
    >
      <Text
        className={`font-medium ${selected ? 'text-background' : 'text-foreground'}`}
        onPress={onPress}
      >
        {label}
      </Text>
    </View>
  );
}
