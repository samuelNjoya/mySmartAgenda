/**
 * Écran Tâches (VERSION AMÉLIORÉE)
 * Avec BottomSheet pour formulaires et design optimisé
 */

import React, { useState, useCallback, useRef } from 'react';
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
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { formatDate, isTodayCheck } from '../../utils/dateHelpers';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { Task, TaskList } from '../../types';
import { Spinner, EmptyState, BottomSheet, BottomSheetRef } from '../../components/common';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

// Import du formulaire
import { TaskForm } from './TaskForm';

// ==================== TYPES ====================

type FilterType = 'all' | 'today' | 'week' | 'overdue' | 'completed';

// ==================== COMPOSANT PRINCIPAL ====================

export function TasksScreen() {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedListId, setSelectedListId] = useState<string>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>();

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
   * CORRECTION: Logique de filtrage corrigée pour Aujourd'hui et Semaine
   * - Aujourd'hui: tâches avec dueDate === aujourd'hui OU sans date
   * - Semaine: tâches avec dueDate <= aujourd'hui+7 OU sans date
   * - Comparaison de dates fixée (utiliser .setHours(0,0,0,0) pour comparer seulement la date)
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
        // CORRECTION: Inclure les tâches d'aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset heures pour comparaison date uniquement
        
        filtered = filtered.filter((t) => {
          if (t.completed) return false;
          
          // Si pas de date, ne pas inclure dans Aujourd'hui
          if (!t.dueDate) return false;
          
          const taskDate = new Date(t.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          
          return taskDate.getTime() === today.getTime();
        });
        break;

      case 'week':
        // CORRECTION: Inclure les tâches de cette semaine (aujourd'hui à +7 jours)
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter((t) => {
          if (t.completed) return false;
          
          // Si pas de date, ne pas inclure dans Semaine
          if (!t.dueDate) return false;
          
          const taskDate = new Date(t.dueDate);
          
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
        break;

      case 'overdue':
        // Tâches en retard (date passée et non complétées)
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter((t) => {
          if (t.completed || !t.dueDate) return false;
          
          const taskDate = new Date(t.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          
          return taskDate < now;
        });
        break;

      case 'completed':
        filtered = filtered.filter((t) => t.completed);
        break;

      case 'all':
      default:
        // Toutes les tâches non complétées
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
            ? 'Tâche terminée !'
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
  function openTaskForm(taskId?: string) {
    setEditingTaskId(taskId);
    bottomSheetRef.current?.open();
  }

  /**
   * Ferme le formulaire et recharge les données
   */
  async function closeTaskForm() {
    bottomSheetRef.current?.close();
    setEditingTaskId(undefined);
    await loadData();
  }

  /**
   * Navigation vers les détails (supprimée - pas besoin)
   */

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
    return <Spinner fullScreen message="Chargement..." />;
  }

  const filteredTasks = getFilteredTasks();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Filtres compacts */}
      <View style={[styles.filtersContainer, { borderBottomColor: colors.border }]}>
        <View style={styles.filterRow}>
          {[
            { key: 'all', label: 'Toutes', icon: 'list' },
            { key: 'today', label: 'Aujourd\'hui', icon: 'today' },
            { key: 'week', label: 'Semaine', icon: 'calendar' },
            { key: 'overdue', label: 'Retard', icon: 'alert-circle' },
            { key: 'completed', label: 'Faites', icon: 'checkmark-done' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.filterButton,
                filter === item.key && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => setFilter(item.key as FilterType)}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={filter === item.key ? '#FFFFFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterText,
                  {
                    color: filter === item.key ? '#FFFFFF' : colors.textSecondary,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Liste des tâches */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="checkmark-done-outline"
          title="Aucune tâche"
          message={
            filter === 'completed'
              ? 'Aucune tâche terminée'
              : "Créez votre première tâche"
          }
          actionLabel="Nouvelle tâche"
          onAction={() => openTaskForm()}
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
            <TouchableOpacity
              style={[
                styles.taskCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => openTaskForm(item.id)}
              activeOpacity={0.7}
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
                  size={24}
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
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                {/* Métadonnées compactes */}
                <View style={styles.taskMeta}>
                  {item.dueDate && (
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="calendar-outline"
                        size={12}
                        color={colors.textSecondary}
                      />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {formatDate(new Date(item.dueDate), 'd MMM')}
                      </Text>
                    </View>
                  )}

                  {item.subtasks.length > 0 && (
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="checkbox-outline"
                        size={12}
                        color={colors.textSecondary}
                      />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {item.subtasks.filter((s) => s.completed).length}/{item.subtasks.length}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Badge priorité */}
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(item.priority) },
                ]}
              />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bouton flottant */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => openTaskForm()}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* BottomSheet pour formulaire */}
      <BottomSheet ref={bottomSheetRef} snapPoint={0.92}>
        <TaskForm
          taskId={editingTaskId}
          listId={selectedListId !== 'all' ? selectedListId : 'default'}
          onClose={closeTaskForm}
        />
      </BottomSheet>
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    borderBottomWidth: 1,
    paddingVertical: SPACING.xs,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xs,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginHorizontal: 2,
  },
  filterText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  listContent: {
    padding: SPACING.sm,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  taskContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  taskTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    fontSize: 11,
  },
  priorityBadge: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginLeft: SPACING.xs,
  },
  fab: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
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