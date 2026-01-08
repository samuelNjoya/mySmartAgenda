/**
 * Formulaire Habitude (PROFESSIONNEL)
 * 
 * CORRECTIONS:
 * 1. CategoryPicker en MODAL (plus de ScrollView horizontal)
 * 2. Vraies icônes Ionicons (plus d'emojis 😴🎯💪)
 * 3. Design compact et pro
 * 4. Spinner avant toast conservé
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/Sizes';
import { validateHabit } from '../../../utils/validation';
import { storage, STORAGE_KEYS, saveItemToList } from '../../../services/storage';
import { Habit } from '../../../types';
import { Input, Button, CategoryPicker } from '../../../components/common';
import Toast from 'react-native-toast-message';
import { HABIT_CATEGORIES, getCategoryColor, getCategoryIcon, getCategoryName } from '../../../constants/Categories';

interface HabitFormProps {
  habitId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function HabitForm({ habitId, onClose, onSuccess }: HabitFormProps) {
  const { colors } = useTheme();
  const isEditing = !!habitId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [categoryId, setCategoryId] = useState(HABIT_CATEGORIES[0].id);
  
  // CORRECTION: Modal pour catégories
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadHabit();
    }
  }, []);

  async function loadHabit() {
    try {
      const habits = (await storage.get<Habit[]>(STORAGE_KEYS.HABITS)) || [];
      const habit = habits.find((h) => h.id === habitId);
      if (habit) {
        setName(habit.name);
        setDescription(habit.description || '');
        setFrequency(habit.frequency);
        // Utiliser icon comme categoryId temporairement (si c'est un ancien habit avec emoji)
        // Sinon trouver la catégorie par l'icône
        const foundCategory = HABIT_CATEGORIES.find(c => c.icon === habit.icon);
        setCategoryId(foundCategory?.id || HABIT_CATEGORIES[0].id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  async function handleSave() {
    try {
      setShowSpinner(true);
      setSaving(true);

      await new Promise(resolve => setTimeout(resolve, 500));

      const errors = validateHabit({ name });
      if (errors.length > 0) {
        setShowSpinner(false);
        Toast.show({
          type: 'error',
          text1: errors[0].message,
        });
        setSaving(false);
        return;
      }

      const color = getCategoryColor(categoryId, 'habit');
      const icon = getCategoryIcon(categoryId, 'habit');

      const habit: Habit = {
        id: habitId || `habit_${Date.now()}`,
        name,
        description,
        color,
        icon, // Nom de l'icône Ionicons (plus d'emojis)
        frequency,
        reminders: [],
        startDate: new Date(),
        archived: false,
        createdAt: new Date(),
      };

      await saveItemToList(STORAGE_KEYS.HABITS, habit);

      setShowSpinner(false);

      Toast.show({
        type: 'success',
        text1: isEditing ? '✅ Habitude modifiée' : '✅ Habitude créée',
      });

      onSuccess();
      onClose();
    } catch (error) {
      setShowSpinner(false);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de sauvegarder',
      });
    } finally {
      setSaving(false);
    }
  }

  const selectedCategory = HABIT_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <View style={styles.container}>
      {/* SPINNER */}
      <Modal transparent visible={showSpinner} animationType="fade">
        <View style={styles.spinnerOverlay}>
          <View style={[styles.spinnerContainer, { backgroundColor: colors.card }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.spinnerText, { color: colors.text }]}>
              {isEditing ? 'Modification...' : 'Création...'}
            </Text>
          </View>
        </View>
      </Modal>

      <Text style={[styles.header, { color: colors.text }]}>
        {isEditing ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
      </Text>

      <Input
        label="Nom de l'habitude"
        placeholder="Ex: Faire du sport"
        value={name}
        onChangeText={setName}
        required
      />

      <Input
        label="Description (optionnel)"
        placeholder="Détails..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={2}
      />

      {/* CORRECTION: Bouton modal pour catégorie (plus de ScrollView) */}
      <Text style={[styles.label, { color: colors.text }]}>Catégorie</Text>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          {
            backgroundColor: selectedCategory ? selectedCategory.color + '15' : colors.surface,
            borderColor: selectedCategory ? selectedCategory.color : colors.border,
          },
        ]}
        onPress={() => setShowCategoryPicker(true)}
      >
        {selectedCategory && (
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: selectedCategory.color + '20' },
            ]}
          >
            <Ionicons
              name={selectedCategory.icon as any}
              size={22}
              color={selectedCategory.color}
            />
          </View>
        )}
        <Text
          style={[
            styles.categoryText,
            { color: selectedCategory ? selectedCategory.color : colors.text },
          ]}
        >
          {getCategoryName(categoryId, 'habit')}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Modal de sélection */}
      <CategoryPicker
        visible={showCategoryPicker}
        categories={HABIT_CATEGORIES}
        selectedId={categoryId}
        onSelect={setCategoryId}
        onClose={() => setShowCategoryPicker(false)}
      />

      {/* Fréquence */}
      <Text style={[styles.label, { color: colors.text }]}>Fréquence</Text>
      <View style={styles.frequencyRow}>
        {[
          { key: 'daily', label: 'Quotidien', icon: 'today' },
          { key: 'weekly', label: 'Hebdo', icon: 'calendar' },
          { key: 'monthly', label: 'Mensuel', icon: 'calendar-outline' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.frequencyButton,
              {
                backgroundColor: frequency === item.key ? colors.primary : colors.surface,
                borderColor: frequency === item.key ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFrequency(item.key as any)}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={frequency === item.key ? '#FFFFFF' : colors.text}
            />
            <Text
              style={[
                styles.frequencyText,
                { color: frequency === item.key ? '#FFFFFF' : colors.text },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Annuler"
          onPress={onClose}
          variant="outline"
          style={styles.actionButton}
          disabled={saving}
        />
        <Button
          title="Enregistrer"
          onPress={handleSave}
          loading={saving}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.sm,
  },
  spinnerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  spinnerText: {
    marginTop: SPACING.sm,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  header: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  categoryText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  frequencyButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
  },
  frequencyText: {
    fontSize: TYPOGRAPHY.tiny.fontSize,
    fontWeight: '600',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
});