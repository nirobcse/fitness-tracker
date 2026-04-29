/**
 * Settings Screen - App preferences and configuration
 */

import { ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useFitness } from '@/lib/fitness-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function SettingsScreen() {
  const { settings, updateSettings } = useFitness();
  const colorScheme = useColorScheme();
  const [localSettings, setLocalSettings] = useState(settings);

  useFocusEffect(
    useCallback(() => {
      setLocalSettings(settings);
    }, [settings])
  );

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    const updated = { ...localSettings, theme };
    setLocalSettings(updated);
    await updateSettings(updated);
  };

  const handleUnitsChange = async (units: 'metric' | 'imperial') => {
    const updated = { ...localSettings, units };
    setLocalSettings(updated);
    await updateSettings(updated);
  };

  const handleNotificationsChange = async (value: boolean) => {
    const updated = { ...localSettings, notificationsEnabled: value };
    setLocalSettings(updated);
    await updateSettings(updated);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-muted">Customize your experience</Text>
          </View>

          {/* Appearance */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Appearance</Text>
            <View className="bg-surface rounded-lg border border-border overflow-hidden">
              <SettingOption
                label="Light Mode"
                selected={localSettings.theme === 'light'}
                onPress={() => handleThemeChange('light')}
              />
              <View className="h-px bg-border" />
              <SettingOption
                label="Dark Mode"
                selected={localSettings.theme === 'dark'}
                onPress={() => handleThemeChange('dark')}
              />
              <View className="h-px bg-border" />
              <SettingOption
                label="Auto (System)"
                selected={localSettings.theme === 'auto'}
                onPress={() => handleThemeChange('auto')}
              />
            </View>
          </View>

          {/* Preferences */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Preferences</Text>
            <View className="bg-surface rounded-lg border border-border overflow-hidden">
              <View className="p-4 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Units</Text>
                  <Text className="text-muted text-sm">
                    {localSettings.units === 'metric' ? 'Metric (kg, km)' : 'Imperial (lbs, mi)'}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    handleUnitsChange(
                      localSettings.units === 'metric' ? 'imperial' : 'metric'
                    )
                  }
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className="bg-primary rounded-full px-3 py-1">
                    <Text className="text-background font-semibold text-sm">
                      {localSettings.units === 'metric' ? 'Metric' : 'Imperial'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">Notifications</Text>
            <View className="bg-surface rounded-lg border border-border p-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Enable Notifications</Text>
                <Text className="text-muted text-sm">Get reminders for your workouts</Text>
              </View>
              <Switch
                value={localSettings.notificationsEnabled}
                onValueChange={handleNotificationsChange}
                trackColor={{ false: '#767577', true: '#81C784' }}
              />
            </View>
          </View>

          {/* About */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">About</Text>
            <View className="bg-surface rounded-lg border border-border p-4 gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground">App Version</Text>
                <Text className="text-muted font-semibold">1.0.0</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground">Build</Text>
                <Text className="text-muted font-semibold">1</Text>
              </View>
            </View>
          </View>

          {/* Info */}
          <View className="bg-surface rounded-lg border border-border p-4">
            <Text className="text-muted text-sm text-center leading-relaxed">
              Fitness Tracker helps you log workouts, track check-ins, and monitor your progress
              towards your fitness goals.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View className="p-4 flex-row items-center justify-between">
        <Text className={`font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>
          {label}
        </Text>
        {selected && <Text className="text-primary text-lg">✓</Text>}
      </View>
    </Pressable>
  );
}
