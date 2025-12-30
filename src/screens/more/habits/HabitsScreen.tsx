/**
 * Écran Habitudes
 * Suivi des habitudes quotidiennes
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/Sizes';
import { formatDate } from '../../../utils/dateHelpers';
import { storage, STORAGE_KEYS } from '../../../services/storage';
import { Habit, HabitLog } from '../../../types';
import { Spinner, EmptyState } from '../../../components/common';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

export function HabitsScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    try {
      setLoading(true);
      const allHabits = (await storage.get<Habit[]>(STORAGE_KEYS.HABITS)) || [];
      const activeHabits = allHabits.filter((h) => !h.archived);
      setHabits(activeHabits);

      const allLogs = (await storage.get<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS)) || [];
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      const todayLogs = allLogs.filter((l) => l.date === today);
      setLogs(todayLogs);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les habitudes',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function toggleHabit(habitId: string) {
    try {
      const allLogs = (await storage.get<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS)) || [];
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      const existingLog = allLogs.find((l) => l.habitId === habitId && l.date === today);

      if (existingLog) {
        existingLog.completed = !existingLog.completed;
      } else {
        allLogs.push({
          id: `log_${Date.now()}`,
          habitId,
          date: today,
          completed: true,
        });
      }

      await storage.save(STORAGE_KEYS.HABIT_LOGS, allLogs);
      await loadData();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Habitude mise à jour',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
      });
    }
  }

  function isHabitCompleted(habitId: string): boolean {
    return logs.find((l) => l.habitId === habitId)?.completed || false;
  }

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {habits.length === 0 ? (
        <EmptyState
          icon="fitness"
          title="Aucune habitude"
          message="Créez vos habitudes quotidiennes"
        />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
          }
          renderItem={({ item }) => {
            const completed = isHabitCompleted(item.id);
            return (
              <TouchableOpacity
                style={[
                  styles.habitCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => toggleHabit(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.habitIcon, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.habitEmoji}>{item.icon || '🎯'}</Text>
                </View>
                <View style={styles.habitContent}>
                  <Text style={[styles.habitName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.habitDesc, { color: colors.textSecondary }]}>
                    {item.frequency === 'daily' ? 'Quotidienne' : item.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'}
                  </Text>
                </View>
                <Ionicons
                  name={completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={32}
                  color={completed ? colors.success : colors.textSecondary}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.sm,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitEmoji: {
    fontSize: 24,
  },
  habitContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  habitName: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitDesc: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
});
