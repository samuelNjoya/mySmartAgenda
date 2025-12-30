/**
 * Navigation par onglets (Bottom Tabs)
 * 5 onglets principaux de l'application
 * FIXED: SafeArea pour éviter que la tab bar traverse
 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ICON_SIZES } from '../constants/Sizes';
import { TabParamList } from '../types';

// Import des écrans
import { HomeScreen } from '../screens/home/HomeScreen';
import { CalendarScreen } from '../screens/calendar/CalendarScreen';
import { TasksScreen } from '../screens/tasks/TasksScreen';
import { MoreScreen } from '../screens/more/MoreScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

// ==================== TAB NAVIGATOR ====================

export function TabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom, // FIXED: Ajoute le padding du bas
          paddingBottom: insets.bottom, // FIXED: SafeArea
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      {/* Onglet Aujourd'hui */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Aujourd\'hui',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="today" size={size} color={color} />
          ),
        }}
      />

      {/* Onglet Calendrier */}
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendrier',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />

      {/* Onglet Tâches */}
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: 'Tâches',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done" size={size} color={color} />
          ),
        }}
      />

      {/* Onglet Plus */}
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          title: 'Plus',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="apps" size={size} color={color} />
          ),
        }}
      />

      {/* Onglet Paramètres */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}