/**
 * Écran Détail d'un Événement
 * Affichage complet avec actions (modifier/supprimer)
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
import { Event } from '../../types';
import { Spinner, Button, Card } from '../../components/common';
import Toast from 'react-native-toast-message';

// ==================== COMPOSANT PRINCIPAL ====================

export function EventDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const eventId = route.params?.eventId;

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);

  // ==================== EFFETS ====================

  useEffect(() => {
    loadEvent();
  }, []);

  // ==================== FONCTIONS ====================

  /**
   * Charge l'événement
   */
  async function loadEvent() {
    try {
      setLoading(true);
      const events = (await storage.get<Event[]>(STORAGE_KEYS.EVENTS)) || [];
      const foundEvent = events.find((e) => e.id === eventId);

      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Événement introuvable',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger l\'événement',
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Supprime l'événement
   */
  function handleDelete() {
    Alert.alert(
      'Supprimer l\'événement',
      'Êtes-vous sûr de vouloir supprimer cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await softDelete(STORAGE_KEYS.EVENTS, eventId);
              Toast.show({
                type: 'success',
                text1: 'Événement supprimé',
              });
              navigation.goBack();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible de supprimer l\'événement',
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
    navigation.navigate('EventForm', { eventId });
  }

  // ==================== RENDER ====================

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  if (!event) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête avec couleur et emoji */}
        <Card variant="elevated" style={[styles.header, { borderLeftColor: event.color, borderLeftWidth: 6 }]}>
          <View style={styles.headerContent}>
            <Text style={styles.emoji}>{event.emoji}</Text>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                {event.title}
              </Text>
              <View style={[styles.colorBadge, { backgroundColor: event.color }]} />
            </View>
          </View>
        </Card>

        {/* Description */}
        {event.description && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {event.description}
            </Text>
          </Card>
        )}

        {/* Informations principales */}
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informations
          </Text>

          {/* Date et heure */}
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Date :
            </Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
              {formatDate(new Date(event.startDate), 'PPP')}
            </Text>
          </View>

          {/* Horaire */}
          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Horaire :
            </Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
              {event.allDay
                ? 'Toute la journée'
                : `${formatDate(new Date(event.startDate), 'HH:mm')} - ${formatDate(new Date(event.endDate), 'HH:mm')}`}
            </Text>
          </View>

          {/* Lieu */}
          {event.location && (
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.infoLabel, { color: colors.text }]}>
                Lieu :
              </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                {event.location}
              </Text>
            </View>
          )}

          {/* Catégorie */}
          <View style={styles.infoRow}>
            <Ionicons
              name="pricetag-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Catégorie :
            </Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
              {event.category || 'Aucune'}
            </Text>
          </View>

          {/* Date de création */}
          <View style={styles.infoRow}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Créé le :
            </Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
              {formatDate(new Date(event.createdAt), 'PPP')}
            </Text>
          </View>
        </Card>

        {/* Rappels */}
        {event.reminders.length > 0 && (
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Rappels
            </Text>
            {event.reminders.map((reminder, index) => (
              <View key={reminder.id} style={styles.reminderItem}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.reminderText, { color: colors.text }]}>
                  {reminder.minutes} minutes avant
                </Text>
              </View>
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
    borderLeftWidth: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  colorBadge: {
    width: 40,
    height: 4,
    borderRadius: 2,
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
    minWidth: 80,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    flex: 1,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  reminderText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginLeft: SPACING.sm,
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
