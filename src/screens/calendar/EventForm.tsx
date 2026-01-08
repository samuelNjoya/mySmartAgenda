/**
 * Formulaire d'Événement (PROFESSIONNEL)
 * 
 * CORRECTIONS:
 * 1. CategoryPicker en MODAL (plus de ScrollView horizontal)
 * 2. Vraies icônes Ionicons (plus d'emojis 😴🎯)
 * 3. Design compact et pro
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
import { validateEvent } from '../../utils/validation';
import { storage, STORAGE_KEYS, saveItemToList } from '../../services/storage';
import { Event } from '../../types';
import { Input, Button, CategoryPicker } from '../../components/common';
import Toast from 'react-native-toast-message';
import { EVENT_CATEGORIES, getCategoryColor, getCategoryIcon, getCategoryName } from '../../constants/Categories';

interface EventFormProps {
  eventId?: string;
  initialDate?: Date;
  onClose: () => void;
}

export function EventForm({ eventId, initialDate, onClose }: EventFormProps) {
  const { colors } = useTheme();
  const isEditing = !!eventId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(initialDate || new Date());
  const [endDate, setEndDate] = useState(initialDate || new Date());
  const [allDay, setAllDay] = useState(false);
  const [categoryId, setCategoryId] = useState(EVENT_CATEGORIES[0].id);
  
  // CORRECTION: Modal pour catégories au lieu de ScrollView
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadEvent();
    }
  }, []);

  async function loadEvent() {
    try {
      const events = (await storage.get<Event[]>(STORAGE_KEYS.EVENTS)) || [];
      const event = events.find((e) => e.id === eventId);
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setLocation(event.location || '');
        setStartDate(new Date(event.startDate));
        setEndDate(new Date(event.endDate));
        setAllDay(event.allDay);
        setCategoryId(event.category || EVENT_CATEGORIES[0].id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const errors = validateEvent({ title, startDate, endDate, allDay });
      if (errors.length > 0) {
        Toast.show({
          type: 'error',
          text1: errors[0].message,
        });
        setSaving(false);
        return;
      }

      const color = getCategoryColor(categoryId, 'event');
      const icon = getCategoryIcon(categoryId, 'event');

      const event: Event = {
        id: eventId || `event_${Date.now()}`,
        title,
        description,
        startDate,
        endDate,
        allDay,
        location,
        color,
        category: categoryId,
        emoji: icon, // Stocke le nom de l'icône Ionicons
        recurrence: undefined,
        reminders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveItemToList(STORAGE_KEYS.EVENTS, event);

      Toast.show({
        type: 'success',
        text1: isEditing ? 'Événement modifié' : 'Événement créé',
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

  // Catégorie sélectionnée
  const selectedCategory = EVENT_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: colors.text }]}>
        {isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}
      </Text>

      <Input
        label="Titre"
        placeholder="Nom de l'événement"
        value={title}
        onChangeText={setTitle}
        required
      />

      <Input
        label="Description"
        placeholder="Détails (optionnel)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={2}
      />

      <Input
        label="Lieu"
        placeholder="Lieu (optionnel)"
        value={location}
        onChangeText={setLocation}
      />

      {/* CORRECTION: Bouton pour ouvrir modal catégorie (plus de ScrollView) */}
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
          {getCategoryName(categoryId, 'event')}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Modal de sélection catégorie */}
      <CategoryPicker
        visible={showCategoryPicker}
        categories={EVENT_CATEGORIES}
        selectedId={categoryId}
        onSelect={setCategoryId}
        onClose={() => setShowCategoryPicker(false)}
      />

      {/* Toute la journée */}
      <View style={[styles.switchRow, { borderColor: colors.border }]}>
        <Text style={[styles.switchLabel, { color: colors.text }]}>Toute la journée</Text>
        <Switch
          value={allDay}
          onValueChange={setAllDay}
          trackColor={{ false: colors.disabled, true: colors.primary }}
        />
      </View>

      {/* Dates */}
      <Text style={[styles.label, { color: colors.text }]}>Date de début</Text>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setShowStartDatePicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
        <Text style={[styles.dateText, { color: colors.text }]}>
          {formatDate(startDate, 'PPP')}
        </Text>
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          onChange={(e, date) => {
            setShowStartDatePicker(Platform.OS === 'ios');
            if (date) setStartDate(date);
          }}
        />
      )}

      {!allDay && (
        <>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(startDate, 'HH:mm')}
            </Text>
          </TouchableOpacity>

          {showStartTimePicker && (
            <DateTimePicker
              value={startDate}
              mode="time"
              is24Hour
              onChange={(e, time) => {
                setShowStartTimePicker(Platform.OS === 'ios');
                if (time) setStartDate(time);
              }}
            />
          )}
        </>
      )}

      <Text style={[styles.label, { color: colors.text }]}>Date de fin</Text>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setShowEndDatePicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
        <Text style={[styles.dateText, { color: colors.text }]}>
          {formatDate(endDate, 'PPP')}
        </Text>
      </TouchableOpacity>

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          onChange={(e, date) => {
            setShowEndDatePicker(Platform.OS === 'ios');
            if (date) setEndDate(date);
          }}
        />
      )}

      {!allDay && (
        <>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(endDate, 'HH:mm')}
            </Text>
          </TouchableOpacity>

          {showEndTimePicker && (
            <DateTimePicker
              value={endDate}
              mode="time"
              is24Hour
              onChange={(e, time) => {
                setShowEndTimePicker(Platform.OS === 'ios');
                if (time) setEndDate(time);
              }}
            />
          )}
        </>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button title="Annuler" onPress={onClose} variant="outline" style={styles.actionButton} />
        <Button title="Enregistrer" onPress={handleSave} loading={saving} style={styles.actionButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.sm,
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
  // CORRECTION: Bouton pour ouvrir modal (plus de ScrollView)
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.xs,
  },
  dateText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    flex: 1,
    marginLeft: SPACING.sm,
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