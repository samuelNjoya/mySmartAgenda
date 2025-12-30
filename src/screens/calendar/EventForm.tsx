/**
 * Formulaire d'Événement (Composant pour BottomSheet)
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
import { validateEvent } from '../../utils/validation';
import { storage, STORAGE_KEYS, saveItemToList } from '../../services/storage';
import { Event } from '../../types';
import { Input, Button } from '../../components/common';
import Toast from 'react-native-toast-message';

// ==================== PROPS ====================

interface EventFormProps {
  eventId?: string;
  initialDate?: Date;
  onClose: () => void;
}

// ==================== COMPOSANT ====================

export function EventForm({ eventId, initialDate, onClose }: EventFormProps) {
  const { colors } = useTheme();
  const isEditing = !!eventId;

  // États
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(initialDate || new Date());
  const [endDate, setEndDate] = useState(initialDate || new Date());
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState('#3B82F6');
  const [emoji, setEmoji] = useState('📅');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const colors_list = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  ];

  const emojis = ['📅', '💼', '🎉', '🏋️', '🍽️', '✈️', '📚', '🎬', '🛒', '❤️'];

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
        setColor(event.color);
        setEmoji(event.emoji);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const errors = validateEvent({ title, startDate, endDate });
      if (errors.length > 0) {
        Toast.show({
          type: 'error',
          text1: errors[0].message,
        });
        return;
      }

      const event: Event = {
        id: eventId || `event_${Date.now()}`,
        title,
        description,
        startDate,
        endDate,
        allDay,
        location,
        color,
        category: undefined,
        emoji,
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

  return (
    <View style={styles.container}>
      {/* Titre */}
      <Text style={[styles.header, { color: colors.text }]}>
        {isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}
      </Text>

      {/* Champ titre */}
      <Input
        label="Titre"
        placeholder="Nom de l'événement"
        value={title}
        onChangeText={setTitle}
        required
      />

      {/* Description */}
      <Input
        label="Description"
        placeholder="Détails (optionnel)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={2}
      />

      {/* Lieu */}
      <Input
        label="Lieu"
        placeholder="Lieu (optionnel)"
        value={location}
        onChangeText={setLocation}
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

      {/* Date de début */}
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

      {/* Heure de début */}
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

      {/* Date de fin */}
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

      {/* Heure de fin */}
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

      {/* Couleur */}
      <Text style={[styles.label, { color: colors.text }]}>Couleur</Text>
      <View style={styles.colorRow}>
        {colors_list.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorButton,
              { backgroundColor: c },
              color === c && styles.colorSelected,
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      {/* Emoji */}
      <Text style={[styles.label, { color: colors.text }]}>Icône</Text>
      <View style={styles.emojiRow}>
        {emojis.map((e) => (
          <TouchableOpacity
            key={e}
            style={[
              styles.emojiButton,
              { borderColor: colors.border },
              emoji === e && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
            ]}
            onPress={() => setEmoji(e)}
          >
            <Text style={styles.emojiText}>{e}</Text>
          </TouchableOpacity>
        ))}
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
    marginBottom: SPACING.sm,
  },
  dateText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    flex: 1,
    marginLeft: SPACING.sm,
  },
  colorRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#000',
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
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
