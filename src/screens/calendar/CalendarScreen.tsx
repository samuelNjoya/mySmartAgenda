/**
 * Écran Calendrier avec BottomSheet
 * Vue mensuelle compacte avec événements
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { formatDate, isSameDayCheck } from '../../utils/dateHelpers';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { Event } from '../../types';
import { Spinner, EmptyState, BottomSheet, BottomSheetRef } from '../../components/common';
import Toast from 'react-native-toast-message';

// Import du formulaire
import { EventForm } from './EventForm';

// ==================== COMPOSANT PRINCIPAL ====================

export function CalendarScreen() {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState<any>({});
  const [editingEventId, setEditingEventId] = useState<string | undefined>();

  // ==================== EFFETS ====================

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  // ==================== FONCTIONS ====================

  /**
   * Charge les événements
   */
  async function loadEvents() {
    try {
      setLoading(true);
      const allEvents = (await storage.get<Event[]>(STORAGE_KEYS.EVENTS)) || [];
      const activeEvents = allEvents.filter((e) => !e.deletedAt);
      setEvents(activeEvents);
      generateMarkedDates(activeEvents);
    } catch (error) {
      console.error('Erreur:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les événements',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /**
   * Génère les marqueurs pour le calendrier
   */
  function generateMarkedDates(eventsList: Event[]) {
    const marked: any = {};

    eventsList.forEach((event) => {
      const dateKey = formatDate(new Date(event.startDate), 'yyyy-MM-dd');
      if (!marked[dateKey]) {
        marked[dateKey] = { dots: [] };
      }
      marked[dateKey].dots.push({ color: event.color });
    });

    // Ajouter la sélection
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = colors.primary;
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
      };
    }

    setMarkedDates(marked);
  }

  /**
   * Gère la sélection d'une date
   */
  function handleDayPress(day: DateData) {
    const dateKey = formatDate(new Date(day.year, day.month - 1, day.day), 'yyyy-MM-dd');
    setSelectedDate(dateKey);
    generateMarkedDates(events);
  }

  /**
   * Filtre les événements du jour sélectionné
   */
  function getEventsForSelectedDate(): Event[] {
    return events.filter((event) => {
      const eventDate = formatDate(new Date(event.startDate), 'yyyy-MM-dd');
      return eventDate === selectedDate;
    });
  }

  /**
   * Ouvre le formulaire
   */
  function openEventForm(eventId?: string) {
    setEditingEventId(eventId);
    bottomSheetRef.current?.open();
  }

  /**
   * Ferme le formulaire
   */
  async function closeEventForm() {
    bottomSheetRef.current?.close();
    setEditingEventId(undefined);
    await loadEvents();
  }

  // ==================== RENDER ====================

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  const dayEvents = getEventsForSelectedDate();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Calendrier */}
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markingType="multi-dot"
        markedDates={markedDates}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.card,
          textSectionTitleColor: colors.textSecondary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.disabled,
          monthTextColor: colors.text,
          textMonthFontWeight: '600',
        }}
        style={styles.calendar}
      />

      {/* Liste des événements */}
      <View style={[styles.eventsContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {formatDate(new Date(selectedDate), 'EEEE d MMMM')}
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => openEventForm()}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {dayEvents.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="Aucun événement"
            message="Créez un événement"
            actionLabel="Créer"
            onAction={() => openEventForm()}
          />
        ) : (
          <FlatList
            data={dayEvents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventsList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadEvents();
                }}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.eventCard,
                  {
                    backgroundColor: colors.card,
                    borderLeftColor: item.color,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => openEventForm(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.eventEmoji}>{item.emoji}</Text>
                <View style={styles.eventContent}>
                  <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.eventMeta}>
                    {!item.allDay && (
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                          {formatDate(new Date(item.startDate), 'HH:mm')}
                        </Text>
                      </View>
                    )}
                    {item.location && (
                      <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
                          {item.location}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* BottomSheet pour formulaire */}
      <BottomSheet ref={bottomSheetRef} snapPoint={0.92}>
        <EventForm
          eventId={editingEventId}
          initialDate={new Date(selectedDate)}
          onClose={closeEventForm}
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
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  eventsContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: '600',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    padding: SPACING.sm,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderLeftWidth: 4,
    borderWidth: 1,
  },
  eventEmoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    fontSize: 11,
  },
});