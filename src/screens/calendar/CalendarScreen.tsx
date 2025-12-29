/**
 * Écran Calendrier
 * Affiche le calendrier mensuel avec les événements
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../../constants/Sizes';
import { formatDate, isSameDayCheck } from '../../utils/dateHelpers';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { Event } from '../../types';
import { Spinner, Card, EmptyState, Button } from '../../components/common';
import Toast from 'react-native-toast-message';

// ==================== COMPOSANT PRINCIPAL ====================

export function CalendarScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date(), 'yyyy-MM-dd')
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});

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

      // Marquer les dates avec événements
      const marked: any = {};
      activeEvents.forEach((event) => {
        const dateKey = formatDate(new Date(event.startDate), 'yyyy-MM-dd');
        if (!marked[dateKey]) {
          marked[dateKey] = { marked: true, dotColor: event.color };
        }
      });

      // Marquer la date sélectionnée
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      };

      setMarkedDates(marked);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les événements',
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Sélection d'une date
   */
  function onDayPress(day: DateData) {
    setSelectedDate(day.dateString);

    // Mettre à jour les dates marquées
    const marked = { ...markedDates };
    Object.keys(marked).forEach((key) => {
      if (marked[key].selected) {
        delete marked[key].selected;
        delete marked[key].selectedColor;
      }
    });
    marked[day.dateString] = {
      ...marked[day.dateString],
      selected: true,
      selectedColor: colors.primary,
    };
    setMarkedDates(marked);
  }

  /**
   * Événements pour la date sélectionnée
   */
  function getEventsForSelectedDate(): Event[] {
    return events.filter((event) =>
      isSameDayCheck(new Date(event.startDate), new Date(selectedDate))
    );
  }

  /**
   * Navigation vers le formulaire de création
   */
  function navigateToEventForm() {
    navigation.navigate('EventForm', { date: new Date(selectedDate) });
  }

  /**
   * Navigation vers les détails d'un événement
   */
  function navigateToEventDetail(eventId: string) {
    navigation.navigate('EventDetail', { eventId });
  }

  // ==================== RENDER ====================

  if (loading) {
    return <Spinner fullScreen message="Chargement du calendrier..." />;
  }

  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Calendrier */}
      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          calendarBackground: colors.background,
          textSectionTitleColor: colors.textSecondary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.disabled,
          monthTextColor: colors.text,
          arrowColor: colors.primary,
          'stylesheet.calendar.header': {
            week: {
              marginTop: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          },
        }}
      />

      {/* Liste des événements pour la date sélectionnée */}
      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={[styles.eventsTitle, { color: colors.text }]}>
            {formatDate(new Date(selectedDate), 'EEEE d MMMM')}
          </Text>
          <TouchableOpacity onPress={navigateToEventForm}>
            <Ionicons name="add-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {selectedDateEvents.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="Aucun événement"
            message="Aucun événement prévu pour cette journée"
            actionLabel="Créer un événement"
            onAction={navigateToEventForm}
          />
        ) : (
          <FlatList
            data={selectedDateEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                variant="outlined"
                onPress={() => navigateToEventDetail(item.id)}
                style={styles.eventCard}
              >
                <View style={styles.eventHeader}>
                  <View
                    style={[
                      styles.eventColorBar,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>
                      {item.emoji} {item.title}
                    </Text>
                    <View style={styles.eventMeta}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.eventTime,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item.allDay
                          ? 'Toute la journée'
                          : `${formatDate(
                              new Date(item.startDate),
                              'HH:mm'
                            )} - ${formatDate(
                              new Date(item.endDate),
                              'HH:mm'
                            )}`}
                      </Text>
                    </View>
                    {item.location && (
                      <View style={styles.eventMeta}>
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.eventLocation,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {item.location}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
              </Card>
            )}
          />
        )}
      </View>
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventsContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventsTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventCard: {
    marginBottom: SPACING.sm,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventColorBar: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: SPACING.md,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  eventTime: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginLeft: SPACING.xs,
  },
  eventLocation: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginLeft: SPACING.xs,
  },
});
