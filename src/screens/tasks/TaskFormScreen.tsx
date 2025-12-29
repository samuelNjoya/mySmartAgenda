/**
 * Formulaire de Tâche
 * Création et édition de tâches avec sous-tâches
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { formatDate } from '../../utils/dateHelpers';
import { validateTask, formatErrors } from '../../utils/validation';
import { storage, STORAGE_KEYS, saveItemToList } from '../../services/storage';
import { Task, TaskList, Subtask } from '../../types';
import { Input, Button, Card } from '../../components/common';
import Toast from 'react-native-toast-message';

// ==================== COMPOSANT PRINCIPAL ====================

export function TaskFormScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();

  const taskId = route.params?.taskId;
  const initialListId = route.params?.listId || 'default';
  const isEditing = !!taskId;

  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [dueTime, setDueTime] = useState<string | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hasTime, setHasTime] = useState(false);
  const [listId, setListId] = useState(initialListId);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [saving, setSaving] = useState(false);

  // ==================== EFFETS ====================

  useEffect(() => {
    loadLists();
    if (isEditing) {
      loadTask();
    }
  }, []);

  // ==================== FONCTIONS ====================

  /**
   * Charge les listes
   */
  async function loadLists() {
    try {
      const allLists = (await storage.get<TaskList[]>(STORAGE_KEYS.TASK_LISTS)) || [];
      setLists(allLists.filter((l) => !l.archived));
    } catch (error) {
      console.error('Erreur lors du chargement des listes:', error);
    }
  }

  /**
   * Charge la tâche à éditer
   */
  async function loadTask() {
    try {
      const tasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const task = tasks.find((t) => t.id === taskId);

      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority);
        setListId(task.listId);
        setSubtasks(task.subtasks || []);
        
        if (task.dueDate) {
          setDueDate(new Date(task.dueDate));
        }
        if (task.dueTime) {
          setDueTime(task.dueTime);
          setHasTime(true);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la tâche:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger la tâche',
      });
    }
  }

  /**
   * Sauvegarde la tâche
   */
  async function handleSave() {
    try {
      setSaving(true);

      // Validation
      const errors = validateTask({
        title,
        dueDate,
        dueTime: hasTime ? dueTime : undefined,
      });

      if (errors.length > 0) {
        Toast.show({
          type: 'error',
          text1: 'Erreur de validation',
          text2: formatErrors(errors),
        });
        return;
      }

      // Créer/Mettre à jour la tâche
      const task: Task = {
        id: taskId || `task_${Date.now()}`,
        title,
        description,
        completed: false,
        priority,
        dueDate,
        dueTime: hasTime ? dueTime : undefined,
        listId,
        category: undefined,
        tags: [],
        subtasks,
        reminders: [],
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveItemToList(STORAGE_KEYS.TASKS, task);

      Toast.show({
        type: 'success',
        text1: isEditing ? 'Tâche modifiée' : 'Tâche créée',
        text2: 'La tâche a été sauvegardée avec succès',
      });

      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de sauvegarder la tâche',
      });
    } finally {
      setSaving(false);
    }
  }

  /**
   * Change la date
   */
  function handleDateChange(event: any, selectedDate?: Date) {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  }

  /**
   * Change l'heure
   */
  function handleTimeChange(event: any, selectedTime?: Date) {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setDueTime(`${hours}:${minutes}`);
    }
  }

  /**
   * Ajoute une sous-tâche
   */
  function addSubtask() {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: `subtask_${Date.now()}`,
        title: newSubtask.trim(),
        completed: false,
      };
      setSubtasks([...subtasks, subtask]);
      setNewSubtask('');
      Toast.show({
        type: 'success',
        text1: 'Sous-tâche ajoutée',
      });
    }
  }

  /**
   * Supprime une sous-tâche
   */
  function removeSubtask(subtaskId: string) {
    setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
    Toast.show({
      type: 'success',
      text1: 'Sous-tâche supprimée',
    });
  }

  /**
   * Obtient la couleur de priorité
   */
  function getPriorityColor(p: string): string {
    switch (p) {
      case 'urgent':
        return '#EF4444';
      case 'high':
        return '#F59E0B';
      case 'normal':
        return '#3B82F6';
      case 'low':
        return '#9CA3AF';
      default:
        return '#3B82F6';
    }
  }

  // ==================== RENDER ====================

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Titre */}
        <Input
          label="Titre"
          placeholder="Nom de la tâche"
          value={title}
          onChangeText={setTitle}
          required
          icon="text-outline"
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="Détails de la tâche (optionnel)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          icon="document-text-outline"
        />

        {/* Priorité */}
        <Text style={[styles.label, { color: colors.text }]}>
          Priorité *
        </Text>
        <View style={styles.priorityGrid}>
          {[
            { key: 'low', label: 'Basse' },
            { key: 'normal', label: 'Normale' },
            { key: 'high', label: 'Haute' },
            { key: 'urgent', label: 'Urgente' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.priorityOption,
                {
                  backgroundColor:
                    priority === item.key
                      ? getPriorityColor(item.key)
                      : colors.surface,
                  borderColor:
                    priority === item.key
                      ? getPriorityColor(item.key)
                      : colors.border,
                },
              ]}
              onPress={() => setPriority(item.key as any)}
            >
              <Text
                style={[
                  styles.priorityText,
                  {
                    color: priority === item.key ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Liste */}
        {lists.length > 0 && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>
              Liste
            </Text>
            <View style={styles.listsGrid}>
              {lists.map((list) => (
                <TouchableOpacity
                  key={list.id}
                  style={[
                    styles.listOption,
                    {
                      backgroundColor:
                        listId === list.id ? list.color : colors.surface,
                      borderColor:
                        listId === list.id ? list.color : colors.border,
                    },
                  ]}
                  onPress={() => setListId(list.id)}
                >
                  <Text
                    style={[
                      styles.listText,
                      {
                        color: listId === list.id ? '#FFFFFF' : colors.text,
                      },
                    ]}
                  >
                    {list.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Date d'échéance */}
        <Text style={[styles.label, { color: colors.text }]}>
          Date d'échéance (optionnelle)
        </Text>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {dueDate
              ? formatDate(dueDate, 'PPP')
              : 'Aucune date'}
          </Text>
          {dueDate && (
            <TouchableOpacity onPress={() => setDueDate(undefined)}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Heure */}
        {dueDate && (
          <Card variant="outlined" style={styles.switchCard}>
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>
                Définir une heure
              </Text>
              <Switch
                value={hasTime}
                onValueChange={setHasTime}
                trackColor={{ false: colors.disabled, true: colors.primary }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </Card>
        )}

        {hasTime && (
          <>
            <TouchableOpacity
              style={[
                styles.dateButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.dateText, { color: colors.text }]}>
                {dueTime || '12:00'}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={
                  dueTime
                    ? new Date(`2000-01-01T${dueTime}:00`)
                    : new Date()
                }
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </>
        )}

        {/* Sous-tâches */}
        <Text style={[styles.label, { color: colors.text }]}>
          Sous-tâches (optionnelles)
        </Text>
        {subtasks.map((subtask) => (
          <View
            key={subtask.id}
            style={[
              styles.subtaskItem,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="checkbox-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={[styles.subtaskText, { color: colors.text }]}>
              {subtask.title}
            </Text>
            <TouchableOpacity onPress={() => removeSubtask(subtask.id)}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Ajouter sous-tâche */}
        <View style={styles.addSubtaskContainer}>
          <Input
            placeholder="Nouvelle sous-tâche"
            value={newSubtask}
            onChangeText={setNewSubtask}
            icon="add-outline"
            containerStyle={styles.subtaskInput}
            onSubmitEditing={addSubtask}
          />
          <Button
            title="Ajouter"
            onPress={addSubtask}
            size="small"
            variant="outline"
          />
        </View>

        {/* Boutons d'action */}
        <View style={styles.actions}>
          <Button
            title="Annuler"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title={isEditing ? 'Modifier' : 'Créer'}
            onPress={handleSave}
            loading={saving}
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
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  priorityOption: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  listsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  listOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
  },
  listText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
  switchCard: {
    marginBottom: SPACING.md,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  dateText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    flex: 1,
    marginLeft: SPACING.md,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  subtaskText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
    marginLeft: SPACING.md,
  },
  addSubtaskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  subtaskInput: {
    flex: 1,
    marginBottom: 0,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
});
