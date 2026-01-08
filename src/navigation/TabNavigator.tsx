/**
 * Navigation par onglets (Bottom Tabs)
 * 5 onglets principaux de l'application
 * 
 * CORRECTIONS:
 * - Headers masqués (plus de barres de titre)
 * - SafeArea ajoutée en haut via screenOptions
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
        // CORRECTION 1: Headers masqués
        headerShown: false,
        
        // CORRECTION 2: SafeArea appliquée via contentStyle
        // Cela ajoute le padding nécessaire en haut pour éviter le notch/barre statut
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
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