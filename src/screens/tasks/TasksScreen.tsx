/**
 * Écran Tâches (COMPLET)
 * Gestion complète des tâches avec filtres, tri et actions
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { formatDate, isTodayCheck } from '../../utils/dateHelpers';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { Task, TaskList } from '../../types';
import { Spinner, Card, EmptyState } from '../../components/common';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

// ==================== TYPES ====================

type FilterType = 'all' | 'today' | 'week' | 'overdue' | 'completed';

// ==================== COMPOSANT PRINCIPAL ====================

export function TasksScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedListId, setSelectedListId] = useState<string>('all');

  // ==================== EFFETS ====================

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // ==================== FONCTIONS ====================

  /**
   * Charge les données
   */
  async function loadData() {
    try {
      setLoading(true);

      // Charger tâches
      const allTasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const activeTasks = allTasks.filter((t) => !t.deletedAt);
      setTasks(activeTasks);

      // Charger listes
      const allLists = (await storage.get<TaskList[]>(STORAGE_KEYS.TASK_LISTS)) || [];
      const activeLists = allLists.filter((l) => !l.archived);
      setLists(activeLists);

      // Créer liste par défaut si aucune liste
      if (allLists.length === 0) {
        const defaultList: TaskList = {
          id: 'default',
          name: 'Mes Tâches',
          color: colors.primary,
          order: 0,
          archived: false,
        };
        await storage.save(STORAGE_KEYS.TASK_LISTS, [defaultList]);
        setLists([defaultList]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les tâches',
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
   * Filtre les tâches
   */
  function getFilteredTasks(): Task[] {
    let filtered = [...tasks];

    // Filtrer par liste
    if (selectedListId !== 'all') {
      filtered = filtered.filter((t) => t.listId === selectedListId);
    }

    // Filtrer par type
    switch (filter) {
      case 'today':
        filtered = filtered.filter(
          (t) =>
            !t.completed &&
            t.dueDate &&
            isTodayCheck(new Date(t.dueDate))
        );
        break;
      case 'week':
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() + 7);
        filtered = filtered.filter(
          (t) =>
            !t.completed &&
            t.dueDate &&
            new Date(t.dueDate) <= weekEnd
        );
        break;
      case 'overdue':
        filtered = filtered.filter(
          (t) =>
            !t.completed &&
            t.dueDate &&
            new Date(t.dueDate) < new Date()
        );
        break;
      case 'completed':
        filtered = filtered.filter((t) => t.completed);
        break;
      case 'all':
      default:
        filtered = filtered.filter((t) => !t.completed);
        break;
    }

    // Trier par priorité puis par date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return filtered;
  }

  /**
   * Marque une tâche comme terminée/non terminée
   */
  async function toggleTask(taskId: string) {
    try {
      const allTasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const taskIndex = allTasks.findIndex((t) => t.id === taskId);

      if (taskIndex >= 0) {
        allTasks[taskIndex].completed = !allTasks[taskIndex].completed;
        allTasks[taskIndex].completedAt = allTasks[taskIndex].completed
          ? new Date()
          : undefined;

        await storage.save(STORAGE_KEYS.TASKS, allTasks);
        await loadData();

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
          type: 'success',
          text1: allTasks[taskIndex].completed
            ? 'Tâche terminée ! 🎉'
            : 'Tâche réactivée',
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
   * Navigation vers le formulaire
   */
  function navigateToForm(taskId?: string) {
    navigation.navigate('TaskForm', { taskId, listId: selectedListId !== 'all' ? selectedListId : 'default' });
  }

  /**
   * Navigation vers les détails
   */
  function navigateToDetail(taskId: string) {
    navigation.navigate('TaskDetail', { taskId });
  }

  /**
   * Obtient la couleur de la priorité
   */
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

  /**
   * Obtient le nom de la liste
   */
  function getListName(listId: string): string {
    const list = lists.find((l) => l.id === listId);
    return list?.name || 'Mes Tâches';
  }

  // ==================== RENDER ====================

  if (loading) {
    return <Spinner fullScreen message="Chargement des tâches..." />;
  }

  const filteredTasks = getFilteredTasks();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Filtres rapides */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {[
          { key: 'all', label: 'Toutes', icon: 'list-outline' },
          { key: 'today', label: 'Aujourd\'hui', icon: 'today-outline' },
          { key: 'week', label: 'Cette semaine', icon: 'calendar-outline' },
          { key: 'overdue', label: 'En retard', icon: 'alert-circle-outline' },
          { key: 'completed', label: 'Terminées', icon: 'checkmark-done-outline' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filter === item.key ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setFilter(item.key as FilterType)}
          >
            <Ionicons
              name={item.icon as any}
              size={16}
              color={filter === item.key ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.filterLabel,
                {
                  color: filter === item.key ? '#FFFFFF' : colors.text,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Listes */}
      {lists.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.listsScroll}
          contentContainerStyle={styles.listsContent}
        >
          <TouchableOpacity
            style={[
              styles.listChip,
              {
                backgroundColor:
                  selectedListId === 'all' ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelectedListId('all')}
          >
            <Text
              style={[
                styles.listLabel,
                {
                  color: selectedListId === 'all' ? '#FFFFFF' : colors.text,
                },
              ]}
            >
              Toutes les listes
            </Text>
          </TouchableOpacity>

          {lists.map((list) => (
            <TouchableOpacity
              key={list.id}
              style={[
                styles.listChip,
                {
                  backgroundColor:
                    selectedListId === list.id ? list.color : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedListId(list.id)}
            >
              <Text
                style={[
                  styles.listLabel,
                  {
                    color: selectedListId === list.id ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {list.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Liste des tâches */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="checkmark-done-outline"
          title="Aucune tâche"
          message={
            filter === 'completed'
              ? 'Aucune tâche terminée'
              : "Vous n'avez aucune tâche pour le moment"
          }
          actionLabel="Créer une tâche"
          onAction={() => navigateToForm()}
        />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <Card variant="outlined" style={styles.taskCard}>
              <TouchableOpacity
                style={styles.taskItem}
                onPress={() => navigateToDetail(item.id)}
              >
                {/* Checkbox */}
                <TouchableOpacity
                  onPress={() => toggleTask(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={
                      item.completed
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={28}
                    color={item.completed ? colors.success : colors.textSecondary}
                  />
                </TouchableOpacity>

                {/* Contenu */}
                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskTitle,
                      { color: colors.text },
                      item.completed && styles.taskCompleted,
                    ]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  {/* Métadonnées */}
                  <View style={styles.taskMeta}>
                    {/* Date d'échéance */}
                    {item.dueDate && (
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.metaText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {formatDate(new Date(item.dueDate), 'd MMM')}
                        </Text>
                      </View>
                    )}

                    {/* Liste */}
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="list-outline"
                        size={14}
                        color={colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.metaText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {getListName(item.listId)}
                      </Text>
                    </View>

                    {/* Sous-tâches */}
                    {item.subtasks.length > 0 && (
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="checkbox-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.metaText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {item.subtasks.filter((s) => s.completed).length}/
                          {item.subtasks.length}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Badge de priorité */}
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(item.priority) },
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {item.priority === 'urgent' ? 'URG' : item.priority === 'high' ? 'HAU' : item.priority === 'normal' ? 'NOR' : 'BAS'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>
          )}
        />
      )}

      {/* Bouton flottant */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigateToForm()}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersScroll: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersContent: {
    padding: SPACING.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.sm,
  },
  filterLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  listsScroll: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listsContent: {
    padding: SPACING.md,
  },
  listChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.sm,
  },
  listLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
  },
  taskCard: {
    marginBottom: SPACING.sm,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  taskTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: TYPOGRAPHY.small.fontSize,
    marginLeft: SPACING.xs,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.tiny.fontSize,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
