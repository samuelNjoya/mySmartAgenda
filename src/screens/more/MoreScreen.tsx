/**
 * Écran Plus avec Stack Navigation
 * Hub pour toutes les fonctionnalités avancées
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { Card } from '../../components/common';

// Import des écrans
import { HabitsScreen } from './habits/HabitsScreen';
import { NotesScreen } from './notes/NotesScreen';
import { AnalyticsScreen } from './analytics/AnalyticsScreen';
import { PomodoroScreen } from './pomodoro/PomodoroScreen';

const Stack = createStackNavigator();

// ==================== HUB PRINCIPAL ====================

function MoreHub() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const features = [
    {
      id: 'habits',
      title: 'Habitudes',
      description: 'Suivez vos habitudes quotidiennes',
      icon: 'fitness' as const,
      color: '#10B981',
      screen: 'Habits',
    },
    {
      id: 'notes',
      title: 'Notes',
      description: 'Créez et organisez vos notes',
      icon: 'document-text' as const,
      color: '#F59E0B',
      screen: 'Notes',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Visualisez vos statistiques',
      icon: 'bar-chart' as const,
      color: '#8B5CF6',
      screen: 'Analytics',
    },
    {
      id: 'pomodoro',
      title: 'Pomodoro',
      description: 'Timer de productivité',
      icon: 'timer' as const,
      color: '#EF4444',
      screen: 'Pomodoro',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Fonctionnalités
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Explorez toutes les fonctionnalités
          </Text>
        </View>

        {/* Grille de fonctionnalités */}
        <View style={styles.grid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => navigation.navigate(feature.screen)}
              activeOpacity={0.7}
            >
              <Card
                variant="elevated"
                style={[styles.featureCardInner, { backgroundColor: colors.card }]}
              >
                {/* Icône */}
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: feature.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={feature.icon}
                    size={28}
                    color={feature.color}
                  />
                </View>

                {/* Contenu */}
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ==================== STACK NAVIGATOR ====================

export function MoreScreen() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
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
      <Stack.Screen
        name="MoreHub"
        component={MoreHub}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Habits"
        component={HabitsScreen}
        options={{ title: 'Habitudes' }}
      />
      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{ title: 'Notes' }}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Stack.Screen
        name="Pomodoro"
        component={PomodoroScreen}
        options={{ title: 'Pomodoro' }}
      />
    </Stack.Navigator>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.sm,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  featureCard: {
    width: '50%',
    padding: SPACING.xs,
  },
  featureCardInner: {
    height: 160,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: TYPOGRAPHY.small.fontSize,
    lineHeight: 16,
  },
});
