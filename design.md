# Fitness Tracker App - Design Document

## Overview
A mobile fitness tracking app designed for iOS-like experience with portrait orientation (9:16) and one-handed usage. The app helps users log daily workouts, track check-ins, and monitor progress over time.

## Screen List

### 1. Home Screen
- **Purpose**: Dashboard showing today's activity summary and quick actions
- **Content**:
  - Daily summary card: Today's total workouts, calories burned, duration
  - Quick action buttons: "Log Workout", "Check-in"
  - Recent workouts list (last 3-5 workouts)
  - Weekly overview chart (activity trend)
- **Functionality**: Navigate to workout logging, check-in, or workout details

### 2. Workout Logger Screen
- **Purpose**: Log a new workout session
- **Content**:
  - Workout type selector (Running, Cycling, Strength, Yoga, Other)
  - Duration input (minutes)
  - Intensity selector (Light, Moderate, High)
  - Calories burned (auto-calculated or manual input)
  - Notes field (optional)
  - Save button
- **Functionality**: Record workout data and return to home

### 3. Check-in Screen
- **Purpose**: Quick daily check-in for mood, energy, and motivation
- **Content**:
  - Date display
  - Mood selector (5-point scale: Very Bad to Very Good)
  - Energy level selector (5-point scale)
  - Motivation level selector (5-point scale)
  - Notes field (optional)
  - Save button
- **Functionality**: Record check-in data and show confirmation

### 4. Progress Tracking Screen
- **Purpose**: View progress over time with charts and statistics
- **Content**:
  - Time period selector (Week, Month, All Time)
  - Total workouts count
  - Total calories burned
  - Average workout duration
  - Line chart: Workouts per day/week
  - Bar chart: Calories burned trend
  - Streak counter (consecutive days with activity)
- **Functionality**: Filter by time period, view detailed statistics

### 5. Workout History Screen
- **Purpose**: View all logged workouts with filtering and details
- **Content**:
  - List of all workouts (newest first)
  - Each item shows: date, type, duration, calories, intensity
  - Filter buttons (by type, date range)
  - Search functionality
  - Tap to view/edit workout details
- **Functionality**: Browse, filter, and manage workout history

### 6. Workout Detail Screen
- **Purpose**: View or edit a specific workout
- **Content**:
  - Workout type, date, time
  - Duration, calories, intensity
  - Notes
  - Edit and delete buttons
- **Functionality**: Update or remove workout entries

### 7. Settings Screen
- **Purpose**: Configure app preferences
- **Content**:
  - Theme toggle (Light/Dark)
  - Units preference (Metric/Imperial)
  - Notification settings
  - About section
- **Functionality**: Customize app behavior

## Primary Content and Functionality

### Home Screen Flow
- Display today's summary with key metrics
- Show recent workouts in a scrollable list
- Provide quick access to logging and check-in
- Display weekly activity chart for motivation

### Workout Logging Flow
- User selects workout type from predefined list
- Input duration and intensity
- System calculates calories (based on type, duration, intensity)
- User can add optional notes
- Confirm and save to local storage

### Check-in Flow
- User rates mood, energy, and motivation on 5-point scales
- Optional notes for context
- Save check-in data linked to current date
- Show confirmation message

### Progress Tracking Flow
- Display aggregated statistics (total workouts, calories, streaks)
- Show visual charts for trends
- Allow filtering by time period
- Display motivational metrics (consecutive active days)

## Key User Flows

### Flow 1: Daily Workout Logging
1. User opens app → Home screen
2. Taps "Log Workout" button
3. Selects workout type (e.g., Running)
4. Enters duration (30 minutes)
5. Selects intensity (Moderate)
6. Reviews auto-calculated calories
7. Adds optional notes
8. Taps "Save"
9. Returns to Home screen with updated summary

### Flow 2: Daily Check-in
1. User opens app → Home screen
2. Taps "Check-in" button
3. Rates mood (4/5 - Good)
4. Rates energy (3/5 - Moderate)
5. Rates motivation (4/5 - Good)
6. Adds optional note ("Great workout today!")
7. Taps "Save"
8. Sees confirmation and returns to Home

### Flow 3: View Progress
1. User opens app → Home screen
2. Taps "Progress" tab
3. Selects time period (This Month)
4. Views statistics: 15 workouts, 3000 calories, 7-day streak
5. Reviews charts showing daily/weekly trends
6. Returns to Home

### Flow 4: Browse Workout History
1. User opens app → Home screen
2. Taps "History" tab
3. Views list of all workouts (newest first)
4. Filters by type (Running) to see only running workouts
5. Taps a workout to view details
6. Can edit or delete the workout
7. Returns to History list

## Color Choices

### Brand Palette
- **Primary**: #0A7EA4 (Teal) - Action buttons, active states
- **Success**: #22C55E (Green) - Positive feedback, completed workouts
- **Warning**: #F59E0B (Amber) - Caution, high intensity
- **Error**: #EF4444 (Red) - Destructive actions, low energy
- **Background**: #FFFFFF (Light) / #151718 (Dark)
- **Surface**: #F5F5F5 (Light) / #1E2022 (Dark)
- **Text**: #11181C (Light) / #ECEDEE (Dark)
- **Muted**: #687076 (Light) / #9BA1A6 (Dark)

### Usage
- Primary teal for "Log Workout", "Check-in", and navigation
- Green for success messages and completed activities
- Amber for high-intensity warnings
- Red for delete/destructive actions
- Neutral grays for secondary content and borders

## Navigation Structure

### Tab Bar (Bottom)
1. **Home** - Daily summary and quick actions
2. **History** - Browse all workouts
3. **Progress** - View statistics and trends
4. **Settings** - App preferences

### Modal/Stack Navigation
- Workout Logger (modal from Home)
- Check-in (modal from Home)
- Workout Detail (stack from History)
- Settings (tab)

## Design Principles

1. **Simplicity**: Minimal UI, focus on core functionality
2. **Feedback**: Clear confirmation for all actions
3. **Consistency**: Unified color scheme and typography
4. **Accessibility**: Large touch targets, high contrast
5. **Performance**: Smooth scrolling, instant feedback
6. **Motivation**: Visual progress indicators and streaks
