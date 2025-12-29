/**
 * Formulaire d'événement
 * Création et édition d'événements
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
import { formatDate, formatTime } from '../../utils/dateHelpers';
import { validateEvent, formatErrors } from '../../utils/validation';
import { storage, STORAGE_KEYS, saveItemToList } from '../../services/storage';
import { Event } from '../../types';
import { Input, Button, Card } from '../../components/common';
import Toast from 'react-native-toast-message';

// Couleurs prédéfinies pour les événements
const EVENT_COLORS = [
  '#3B82F6', // Bleu
  '#10B981', // Vert
  '#EF4444', // Rouge
  '#F59E0B', // Orange
  '#8B5CF6', // Violet
  '#EC4899', // Rose
  '#06B6D4', // Cyan
  '#14B8A6', // Turquoise
];

// Emojis prédéfinis
const EVENT_EMOJIS = ['📅', '💼', '🎯', '🎓', '💪', '🍽️', '✈️', '🎉', '❤️', '🏠'];

// ==================== COMPOSANT PRINCIPAL ====================

export function EventFormScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  
  const eventId = route.params?.eventId;
  const initialDate = route.params?.date || new Date();
  const isEditing = !!eventId;

  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(
    new Date(initialDate.getTime() + 60 * 60 * 1000)
  ); // +1 heure
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(EVENT_EMOJIS[0]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // ==================== EFFETS ====================

  useEffect(() => {
    if (isEditing) {
      loadEvent();
    }
  }, []);

  // ==================== FONCTIONS ====================

  /**
   * Charge l'événement à éditer
   */
  async function loadEvent() {
    try {
      const events = (await storage.get<Event[]>(STORAGE_KEYS.EVENTS)) || [];
      const event = events.find((e) => e.id === eventId);
      
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setStartDate(new Date(event.startDate));
        setEndDate(new Date(event.endDate));
        setAllDay(event.allDay);
        setLocation(event.location || '');
        setSelectedColor(event.color);
        setSelectedEmoji(event.emoji || EVENT_EMOJIS[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger l\'événement',
      });
    }
  }

  /**
   * Sauvegarde l'événement
   */
  async function handleSave() {
    try {
      setSaving(true);

      // Validation
      const errors = validateEvent({
        title,
        startDate,
        endDate,
        allDay,
      });

      if (errors.length > 0) {
        Toast.show({
          type: 'error',
          text1: 'Erreur de validation',
          text2: formatErrors(errors),
        });
        return;
      }

      // Créer/Mettre à jour l'événement
      const event: Event = {
        id: eventId || `event_${Date.now()}`,
        title,
        description,
        startDate,
        endDate,
        allDay,
        location,
        color: selectedColor,
        category: 'default', // TODO: Ajouter sélection de catégorie
        emoji: selectedEmoji,
        reminders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveItemToList(STORAGE_KEYS.EVENTS, event);

      Toast.show({
        type: 'success',
        text1: isEditing ? 'Événement modifié' : 'Événement créé',
        text2: 'L\'événement a été sauvegardé avec succès',
      });

      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de sauvegarder l\'événement',
      });
    } finally {
      setSaving(false);
    }
  }

  /**
   * Change de date de début
   */
  function handleStartDateChange(event: any, selectedDate?: Date) {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      
      // Ajuster automatiquement la date de fin si elle est avant la nouvelle date de début
      if (selectedDate > endDate) {
        setEndDate(new Date(selectedDate.getTime() + 60 * 60 * 1000));
      }
    }
  }

  /**
   * Change de date de fin
   */
  function handleEndDateChange(event: any, selectedDate?: Date) {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  }

  // ==================== RENDER ====================

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Titre */}
        <Input
          label="Titre"
          placeholder="Nom de l'événement"
          value={title}
          onChangeText={setTitle}
          required
          icon="text-outline"
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="Détails de l'événement (optionnel)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          icon="document-text-outline"
        />

        {/* Toute la journée */}
        <Card variant="outlined" style={styles.switchCard}>
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>
              Toute la journée
            </Text>
            <Switch
              value={allDay}
              onValueChange={setAllDay}
              trackColor={{ false: colors.disabled, true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </Card>

        {/* Date de début */}
        <Text style={[styles.label, { color: colors.text }]}>
          Date et heure de début *
        </Text>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => setShowStartPicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {formatDate(startDate, 'PPp')}
          </Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode={allDay ? 'date' : 'datetime'}
            is24Hour={true}
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        {/* Date de fin */}
        <Text style={[styles.label, { color: colors.text }]}>
          Date et heure de fin *
        </Text>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => setShowEndPicker(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {formatDate(endDate, 'PPp')}
          </Text>
        </TouchableOpacity>

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode={allDay ? 'date' : 'datetime'}
            is24Hour={true}
            display="default"
            onChange={handleEndDateChange}
            minimumDate={startDate}
          />
        )}

        {/* Lieu */}
        <Input
          label="Lieu"
          placeholder="Adresse ou lieu (optionnel)"
          value={location}
          onChangeText={setLocation}
          icon="location-outline"
        />

        {/* Couleur */}
        <Text style={[styles.label, { color: colors.text }]}>Couleur</Text>
        <View style={styles.colorGrid}>
          {EVENT_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Emoji */}
        <Text style={[styles.label, { color: colors.text }]}>Icône</Text>
        <View style={styles.emojiGrid}>
          {EVENT_EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.emojiOption,
                { borderColor: colors.border },
                selectedEmoji === emoji && {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setSelectedEmoji(emoji)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
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
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  dateText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginLeft: SPACING.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    margin: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    margin: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 24,
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
