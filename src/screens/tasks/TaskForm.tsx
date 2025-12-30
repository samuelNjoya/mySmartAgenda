/**
 * Formulaire de Tâche (Composant pour BottomSheet)
 * Version compacte sans marges excessives
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { formatDate } from '../../utils/dateHelpers';
import { validateTask } from '../../utils/validation';
import { storage, STORAGE_KEYS, saveItemToList } from '../../services/storage';
import { Task, TaskList, Subtask } from '../../types';
import { Input, Button } from '../../components/common';
import Toast from 'react-native-toast-message';

// ==================== PROPS ====================

interface TaskFormProps {
  taskId?: string;
  listId: string;
  onClose: () => void;
}

// ==================== COMPOSANT ====================

export function TaskForm({ taskId, listId, onClose }: TaskFormProps) {
  const { colors } = useTheme();
  const isEditing = !!taskId;

  // États
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [hasTime, setHasTime] = useState(false);
  const [dueTime, setDueTime] = useState<string | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadTask();
    }
  }, []);

  async function loadTask() {
    try {
      const tasks = (await storage.get<Task[]>(STORAGE_KEYS.TASKS)) || [];
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority);
        setSubtasks(task.subtasks || []);
        if (task.dueDate) setDueDate(new Date(task.dueDate));
        if (task.dueTime) {
          setDueTime(task.dueTime);
          setHasTime(true);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const errors = validateTask({ title, dueDate, dueTime: hasTime ? dueTime : undefined });
      if (errors.length > 0) {
        Toast.show({
          type: 'error',
          text1: errors[0].message,
        });
        return;
      }

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
      });

      onClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de sauvegarder',
      });
    } finally {
      setSaving(false);
    }
  }

  function addSubtask() {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, {
        id: `sub_${Date.now()}`,
        title: newSubtask.trim(),
        completed: false,
      }]);
      setNewSubtask('');
    }
  }

  function removeSubtask(id: string) {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'normal': return '#3B82F6';
      case 'low': return '#9CA3AF';
      default: return '#3B82F6';
    }
  };

  return (
    <View style={styles.container}>
      {/* Titre */}
      <Text style={[styles.header, { color: colors.text }]}>
        {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
      </Text>

      {/* Champ titre */}
      <Input
        label="Titre"
        placeholder="Nom de la tâche"
        value={title}
        onChangeText={setTitle}
        required
      />

      {/* Priorité */}
      <Text style={[styles.label, { color: colors.text }]}>Priorité</Text>
      <View style={styles.priorityRow}>
        {[
          { key: 'low', label: 'Basse' },
          { key: 'normal', label: 'Normale' },
          { key: 'high', label: 'Haute' },
          { key: 'urgent', label: 'Urgente' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.priorityButton,
              {
                backgroundColor: priority === item.key ? getPriorityColor(item.key) : colors.surface,
                borderColor: priority === item.key ? getPriorityColor(item.key) : colors.border,
              },
            ]}
            onPress={() => setPriority(item.key as any)}
          >
            <Text
              style={[
                styles.priorityText,
                { color: priority === item.key ? '#FFFFFF' : colors.text },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date */}
      <Text style={[styles.label, { color: colors.text }]}>Date d'échéance</Text>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
        <Text style={[styles.dateText, { color: colors.text }]}>
          {dueDate ? formatDate(dueDate, 'PPP') : 'Aucune'}
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
          onChange={(e, date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (date) setDueDate(date);
          }}
        />
      )}

      {/* Heure */}
      {dueDate && (
        <View style={[styles.switchRow, { borderColor: colors.border }]}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>Définir une heure</Text>
          <Switch
            value={hasTime}
            onValueChange={setHasTime}
            trackColor={{ false: colors.disabled, true: colors.primary }}
          />
        </View>
      )}

      {hasTime && (
        <>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {dueTime || '12:00'}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={dueTime ? new Date(`2000-01-01T${dueTime}`) : new Date()}
              mode="time"
              is24Hour
              onChange={(e, time) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (time) {
                  const h = time.getHours().toString().padStart(2, '0');
                  const m = time.getMinutes().toString().padStart(2, '0');
                  setDueTime(`${h}:${m}`);
                }
              }}
            />
          )}
        </>
      )}

      {/* Sous-tâches */}
      <Text style={[styles.label, { color: colors.text }]}>Sous-tâches</Text>
      {subtasks.map((sub) => (
        <View key={sub.id} style={[styles.subtaskItem, { borderColor: colors.border }]}>
          <Text style={[styles.subtaskText, { color: colors.text }]}>{sub.title}</Text>
          <TouchableOpacity onPress={() => removeSubtask(sub.id)}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}

      {/* Ajouter sous-tâche */}
      <View style={styles.addSubtaskRow}>
        <Input
          placeholder="Nouvelle sous-tâche"
          value={newSubtask}
          onChangeText={setNewSubtask}
          containerStyle={{ flex: 1, marginBottom: 0 }}
          onSubmitEditing={addSubtask}
        />
        <Button title="+" onPress={addSubtask} size="small" style={styles.addButton} />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button title="Annuler" onPress={onClose} variant="outline" style={styles.actionButton} />
        <Button title="Enregistrer" onPress={handleSave} loading={saving} style={styles.actionButton} />
      </View>
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.md,
  },
  header: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  priorityButton: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  dateText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    flex: 1,
    marginLeft: SPACING.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  switchLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.xs,
  },
  subtaskText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    flex: 1,
  },
  addSubtaskRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  addButton: {
    minWidth: 50,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
  },
});
