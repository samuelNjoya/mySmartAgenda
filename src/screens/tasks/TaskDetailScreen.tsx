/**
 * Écran Détail d'une Tâche
 * Affichage complet avec sous-tâches et actions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { formatDate } from '../../utils/dateHelpers';
import { storage, STORAGE_KEYS, softDelete } from '../../services/storage';
import { Task } from '../../types';
import { Spinner, Button, Card } from '../../components/common';
import Toast from 'react-native-toast-message';

// ==================== COMPOSANT PRINCIPAL ====================

export function TaskDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const taskId = route.params?.taskId;

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  // ==================== EFFETS ====================

  useEffect(() => {
    loadTask();
  }, []);

  // ==================== FONCTIONS ====================

  /**
   * Charge la tâche
   */
  async function loadTask() {
    try {
      setLoading(true);
      const tasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const foundTask = tasks.find((t) => t.id === taskId);

      if (foundTask) {
        setTask(foundTask);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Tâche introuvable',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la tâche:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger la tâche',
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Supprime la tâche
   */
  function handleDelete() {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await softDelete(STORAGE_KEYS.TASKS, taskId);
              Toast.show({
                type: 'success',
                text1: 'Tâche supprimée',
              });
              navigation.goBack();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible de supprimer la tâche',
              });
            }
          },
        },
      ]
    );
  }

  /**
   * Navigation vers l'édition
   */
  function navigateToEdit() {
    navigation.navigate('TaskForm', { taskId });
  }

  /**
   * Marque la tâche comme terminée/non terminée
   */
  async function toggleComplete() {
    if (!task) return;

    try {
      const tasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const taskIndex = tasks.findIndex((t) => t.id === taskId);

      if (taskIndex >= 0) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        tasks[taskIndex].completedAt = tasks[taskIndex].completed
          ? new Date()
          : undefined;

        await storage.save(STORAGE_KEYS.TASKS, tasks);
        setTask(tasks[taskIndex]);

        Toast.show({
          type: 'success',
          text1: tasks[taskIndex].completed
            ? 'Tâche terminée ! 🎉'
            : 'Tâche réactivée',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de mettre à jour la tâche',
      });
    }
  }

  /**
   * Toggle une sous-tâche
   */
  async function toggleSubtask(subtaskId: string) {
    if (!task) return;

    try {
      const tasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const taskIndex = tasks.findIndex((t) => t.id === taskId);

      if (taskIndex >= 0) {
        const subtaskIndex = tasks[taskIndex].subtasks.findIndex(
          (s) => s.id === subtaskId
        );
        if (subtaskIndex >= 0) {
          tasks[taskIndex].subtasks[subtaskIndex].completed =
            !tasks[taskIndex].subtasks[subtaskIndex].completed;

          await storage.save(STORAGE_KEYS.TASKS, tasks);
          setTask(tasks[taskIndex]);
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de mettre à jour la sous-tâche',
      });
    }
  }

  /**
   * Obtient la couleur de priorité
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
   * Obtient le label de priorité
   */
  function getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Haute';
      case 'normal':
        return 'Normale';
      case 'low':
        return 'Basse';
      default:
        return 'Normale';
    }
  }

  // ==================== RENDER ====================

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  if (!task) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête avec statut */}
        <Card variant="elevated">
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleComplete}>
              <Ionicons
                name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={40}
                color={task.completed ? colors.success : colors.textSecondary}
              />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                  task.completed && styles.completed,
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
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Description */}
        {task.description && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {task.description}
            </Text>
          </Card>
        )}

        {/* Informations */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informations
          </Text>

          {/* Date d'échéance */}
          {task.dueDate && (
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.infoLabel, { color: colors.text }]}>
                Échéance :
              </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                {formatDate(new Date(task.dueDate), 'PPP')}
                {task.dueTime && ` à ${task.dueTime}`}
              </Text>
            </View>
          )}

          {/* Date de création */}
          <View style={styles.infoRow}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Créée le :
            </Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
              {formatDate(new Date(task.createdAt), 'PPP')}
            </Text>
          </View>

          {/* Date de complétion */}
          {task.completedAt && (
            <View style={styles.infoRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={colors.success}
              />
              <Text style={[styles.infoLabel, { color: colors.text }]}>
                Terminée le :
              </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                {formatDate(new Date(task.completedAt), 'PPP')}
              </Text>
            </View>
          )}
        </Card>

        {/* Sous-tâches */}
        {task.subtasks.length > 0 && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Sous-tâches ({task.subtasks.filter((s) => s.completed).length}/
              {task.subtasks.length})
            </Text>

            {task.subtasks.map((subtask) => (
              <TouchableOpacity
                key={subtask.id}
                style={styles.subtaskItem}
                onPress={() => toggleSubtask(subtask.id)}
              >
                <Ionicons
                  name={
                    subtask.completed
                      ? 'checkmark-circle'
                      : 'ellipse-outline'
                  }
                  size={24}
                  color={
                    subtask.completed ? colors.success : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.subtaskText,
                    { color: colors.text },
                    subtask.completed && styles.completed,
                  ]}
                >
                  {subtask.title}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Modifier"
            onPress={navigateToEdit}
            icon="create-outline"
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Supprimer"
            onPress={handleDelete}
            icon="trash-outline"
            variant="danger"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    flex: 1,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subtaskText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginLeft: SPACING.md,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  actionButton: {
    flex: 1,
  },
});
