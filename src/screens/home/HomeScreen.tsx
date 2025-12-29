/**
 * Écran Aujourd'hui (Home/Dashboard)
 * Vue d'ensemble de la journée avec événements, tâches et habitudes
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../../constants/Sizes';
import { getDailyQuote } from '../../constants/Quotes';
import { formatDate, formatDisplayDate, isTodayCheck } from '../../utils/dateHelpers';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { Event, Task, Habit, HabitLog } from '../../types';
import { Spinner, Card, EmptyState } from '../../components/common';
import Toast from 'react-native-toast-message';

// ==================== COMPOSANT PRINCIPAL ====================

export function HomeScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);

  // ==================== EFFETS ====================

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // ==================== FONCTIONS ====================

  /**
   * Charge toutes les données
   */
  async function loadData() {
    try {
      setLoading(true);

      // Citation du jour
      const dailyQuote = getDailyQuote();
      setQuote(dailyQuote);

      // Événements du jour
      const events = (await storage.get<Event[]>(STORAGE_KEYS.EVENTS)) || [];
      const today = new Date();
      const todayEventsFiltered = events.filter(
        (event) =>
          !event.deletedAt && isTodayCheck(new Date(event.startDate))
      );
      setTodayEvents(todayEventsFiltered.sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ));

      // Tâches du jour
      const tasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const todayTasksFiltered = tasks.filter(
        (task) =>
          !task.deletedAt &&
          !task.completed &&
          (task.dueDate ? isTodayCheck(new Date(task.dueDate)) : false)
      );
      setTodayTasks(
        todayTasksFiltered.sort((a, b) => {
          const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
      );

      // Habitudes du jour
      const habits = (await storage.get<Habit[]>(STORAGE_KEYS.HABITS)) || [];
      const activeHabits = habits.filter((h) => !h.archived);
      setTodayHabits(activeHabits);

      // Logs d'habitudes
      const logs = (await storage.get<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS)) || [];
      const todayString = formatDate(today, 'yyyy-MM-dd');
      const todayLogs = logs.filter((log) => log.date === todayString);
      setHabitLogs(todayLogs);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les données',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /**
   * Rafraîchissement
   */
  async function onRefresh() {
    setRefreshing(true);
    await loadData();
  }

  /**
   * Marque une tâche comme terminée
   */
  async function toggleTask(taskId: string) {
    try {
      const tasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      
      if (taskIndex >= 0) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        tasks[taskIndex].completedAt = tasks[taskIndex].completed
          ? new Date()
          : undefined;
        
        await storage.save(STORAGE_KEYS.TASKS, tasks);
        await loadData();
        
        Toast.show({
          type: 'success',
          text1: 'Tâche mise à jour',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de mettre à jour la tâche',
      });
    }
  }

  /**
   * Marque une habitude comme accomplie
   */
  async function toggleHabit(habitId: string) {
    try {
      const logs = (await storage.get<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS)) || [];
      const todayString = formatDate(new Date(), 'yyyy-MM-dd');
      const existingLog = logs.find(
        (log) => log.habitId === habitId && log.date === todayString
      );

      if (existingLog) {
        // Toggle
        existingLog.completed = !existingLog.completed;
      } else {
        // Créer nouveau log
        logs.push({
          id: `log_${Date.now()}`,
          habitId,
          date: todayString,
          completed: true,
        });
      }

      await storage.save(STORAGE_KEYS.HABIT_LOGS, logs);
      await loadData();

      Toast.show({
        type: 'success',
        text1: 'Habitude mise à jour',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'habitude:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de mettre à jour l\'habitude',
      });
    }
  }

  // ==================== RENDER ====================

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* En-tête avec date */}
        <View style={styles.header}>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDate(new Date(), 'EEEE d MMMM yyyy')}
          </Text>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Aujourd'hui
          </Text>
        </View>

        {/* Citation inspirante */}
        <Card variant="elevated" style={styles.quoteCard}>
          <Ionicons
            name="sparkles"
            size={24}
            color={colors.primary}
            style={styles.quoteIcon}
          />
          <Text style={[styles.quoteText, { color: colors.text }]}>
            "{quote.text}"
          </Text>
          <Text style={[styles.quoteAuthor, { color: colors.textSecondary }]}>
            — {quote.author}
          </Text>
        </Card>

        {/* Événements du jour */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Événements ({todayEvents.length})
            </Text>
          </View>

          {todayEvents.length === 0 ? (
            <Card>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucun événement prévu aujourd'hui
              </Text>
            </Card>
          ) : (
            todayEvents.map((event) => (
              <Card key={event.id} variant="outlined" style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View
                    style={[
                      styles.eventColorBar,
                      { backgroundColor: event.color },
                    ]}
                  />
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>
                      {event.emoji} {event.title}
                    </Text>
                    <View style={styles.eventMeta}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.eventTime,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {formatDate(new Date(event.startDate), 'HH:mm')} -{' '}
                        {formatDate(new Date(event.endDate), 'HH:mm')}
                      </Text>
                    </View>
                    {event.location && (
                      <View style={styles.eventMeta}>
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.eventLocation,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {event.location}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Tâches prioritaires */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tâches prioritaires ({todayTasks.length})
            </Text>
          </View>

          {todayTasks.length === 0 ? (
            <Card>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucune tâche pour aujourd'hui
              </Text>
            </Card>
          ) : (
            todayTasks.map((task) => (
              <Card key={task.id} variant="outlined">
                <TouchableOpacity
                  style={styles.taskItem}
                  onPress={() => toggleTask(task.id)}
                >
                  <Ionicons
                    name={
                      task.completed
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={24}
                    color={
                      task.completed ? colors.success : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.taskTitle,
                      { color: colors.text },
                      task.completed && styles.taskCompleted,
                    ]}
                  >
                    {task.title}
                  </Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(task.priority) },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {task.priority.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Card>
            ))
          )}
        </View>

        {/* Habitudes du jour */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Habitudes ({todayHabits.length})
            </Text>
          </View>

          {todayHabits.length === 0 ? (
            <Card>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucune habitude configurée
              </Text>
            </Card>
          ) : (
            todayHabits.map((habit) => {
              const log = habitLogs.find((l) => l.habitId === habit.id);
              const isCompleted = log?.completed || false;

              return (
                <Card key={habit.id} variant="outlined">
                  <TouchableOpacity
                    style={styles.habitItem}
                    onPress={() => toggleHabit(habit.id)}
                  >
                    <View
                      style={[
                        styles.habitIcon,
                        { backgroundColor: habit.color + '20' },
                      ]}
                    >
                      <Text style={styles.habitEmoji}>{habit.icon || '🎯'}</Text>
                    </View>
                    <Text style={[styles.habitName, { color: colors.text }]}>
                      {habit.name}
                    </Text>
                    <Ionicons
                      name={
                        isCompleted
                          ? 'checkmark-circle'
                          : 'ellipse-outline'
                      }
                      size={28}
                      color={isCompleted ? colors.success : colors.textSecondary}
                    />
                  </TouchableOpacity>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ==================== FONCTIONS UTILITAIRES ====================

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return '#EF4444';
    case 'high':
      return '#F59E0B';
    case 'normal':
      return '#3B82F6';
    case 'low':
      return '#9CA3AF';
    default:
      return '#9CA3AF';
  }
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  date: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    textTransform: 'capitalize',
  },
  greeting: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  quoteCard: {
    marginBottom: SPACING.lg,
  },
  quoteIcon: {
    marginBottom: SPACING.sm,
  },
  quoteText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  quoteAuthor: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    textAlign: 'right',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  eventCard: {
    marginBottom: SPACING.sm,
  },
  eventHeader: {
    flexDirection: 'row',
  },
  eventColorBar: {
    width: 4,
    borderRadius: 2,
    marginRight: SPACING.md,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  eventTime: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginLeft: SPACING.xs,
  },
  eventLocation: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginLeft: SPACING.xs,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
    marginLeft: SPACING.md,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.tiny.fontSize,
    fontWeight: '600',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  habitEmoji: {
    fontSize: 20,
  },
  habitName: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
});
