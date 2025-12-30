/**
 * Écran Analytics
 * Statistiques et visualisation des données
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/Sizes';
import { storage, STORAGE_KEYS } from '../../../services/storage';
import { Task, Event, Habit, HabitLog } from '../../../types';
import { Spinner } from '../../../components/common';
import { formatDate } from '../../../utils/dateHelpers';

export function AnalyticsScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalEvents: 0,
    totalHabits: 0,
    completedToday: 0,
  });

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  async function loadStats() {
    try {
      setLoading(true);

      const tasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const events = (await storage.get<Event[]>(STORAGE_KEYS.EVENTS)) || [];
      const habits = (await storage.get<Habit[]>(STORAGE_KEYS.HABITS)) || [];
      const logs = (await storage.get<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS)) || [];

      const activeTasks = tasks.filter((t) => !t.deletedAt);
      const completedTasks = activeTasks.filter((t) => t.completed);
      const activeEvents = events.filter((e) => !e.deletedAt);
      const activeHabits = habits.filter((h) => !h.archived);
      
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      const todayLogs = logs.filter((l) => l.date === today && l.completed);

      setStats({
        totalTasks: activeTasks.length,
        completedTasks: completedTasks.length,
        totalEvents: activeEvents.length,
        totalHabits: activeHabits.length,
        completedToday: todayLogs.length,
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadStats();
          }}
        />
      }
    >
      {/* Taux de complétion */}
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={styles.cardTitle}>Taux de complétion</Text>
        <Text style={styles.cardValue}>{completionRate}%</Text>
        <Text style={styles.cardSubtitle}>
          {stats.completedTasks} / {stats.totalTasks} tâches
        </Text>
      </View>

      {/* Grille de stats */}
      <View style={styles.grid}>
        {/* Tâches */}
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="checkmark-done" size={32} color="#3B82F6" />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalTasks}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tâches</Text>
        </View>

        {/* Événements */}
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="calendar" size={32} color="#10B981" />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalEvents}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Événements</Text>
        </View>

        {/* Habitudes */}
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="fitness" size={32} color="#F59E0B" />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalHabits}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Habitudes</Text>
        </View>

        {/* Aujourd'hui */}
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="today" size={32} color="#8B5CF6" />
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.completedToday}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Aujourd'hui</Text>
        </View>
      </View>

      {/* Message de motivation */}
      <View style={[styles.motivationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="trophy" size={32} color="#F59E0B" />
        <Text style={[styles.motivationText, { color: colors.text }]}>
          {completionRate >= 80
            ? '🎉 Excellent travail !'
            : completionRate >= 50
            ? '💪 Continue comme ça !'
            : '🚀 Tu peux le faire !'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.sm,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: SPACING.xs,
  },
  cardValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: '700',
    marginVertical: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  motivationText: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: '600',
    marginLeft: SPACING.md,
  },
});
