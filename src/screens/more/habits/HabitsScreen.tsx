/**
 * Écran Habitudes COMPLET
 * CRUD complet avec BottomSheet, Spinner avant Toast, Suppression
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/Sizes';
import { formatDate } from '../../../utils/dateHelpers';
import { storage, STORAGE_KEYS, softDelete } from '../../../services/storage';
import { Habit, HabitLog } from '../../../types';
import { Spinner, EmptyState, BottomSheet, BottomSheetRef } from '../../../components/common';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

// Import du formulaire
import { HabitForm } from './HabitForm';

export function HabitsScreen() {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [editingHabitId, setEditingHabitId] = useState<string | undefined>();
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    try {
      setLoading(true);
      const allHabits = (await storage.get<Habit[]>(STORAGE_KEYS.HABITS)) || [];
      const activeHabits = allHabits.filter((h) => !h.archived);
      setHabits(activeHabits);

      const allLogs = (await storage.get<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS)) || [];
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      const todayLogs = allLogs.filter((l) => l.date === today);
      setLogs(todayLogs);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les habitudes',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function toggleHabit(habitId: string) {
    try {
      // SPINNER AVANT TOUT
      setSpinnerMessage('Mise à jour...');
      setShowSpinner(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));

      const allLogs = (await storage.get<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS)) || [];
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      const existingLog = allLogs.find((l) => l.habitId === habitId && l.date === today);

      if (existingLog) {
        existingLog.completed = !existingLog.completed;
      } else {
        allLogs.push({
          id: `log_${Date.now()}`,
          habitId,
          date: today,
          completed: true,
        });
      }

      await storage.save(STORAGE_KEYS.HABIT_LOGS, allLogs);
      await loadData();
      
      setShowSpinner(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: '✅ Habitude mise à jour',
      });
    } catch (error) {
      setShowSpinner(false);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
      });
    }
  }

  function isHabitCompleted(habitId: string): boolean {
    return logs.find((l) => l.habitId === habitId)?.completed || false;
  }

  function openHabitForm(habitId?: string) {
    setEditingHabitId(habitId);
    bottomSheetRef.current?.open();
  }

  async function closeHabitForm() {
    bottomSheetRef.current?.close();
    setEditingHabitId(undefined);
    await loadData();
  }

  async function deleteHabit(habitId: string) {
    Alert.alert(
      'Supprimer l\'habitude',
      'Voulez-vous vraiment supprimer cette habitude ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              // SPINNER AVANT TOUT
              setSpinnerMessage('Suppression...');
              setShowSpinner(true);
              
              await new Promise(resolve => setTimeout(resolve, 500));

              await softDelete(STORAGE_KEYS.HABITS, habitId, 'archived', true);
              await loadData();
              
              setShowSpinner(false);
              
              Toast.show({
                type: 'success',
                text1: '🗑️ Habitude supprimée',
              });
            } catch (error) {
              setShowSpinner(false);
              Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible de supprimer',
              });
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* SPINNER OVERLAY */}
      <Modal transparent visible={showSpinner} animationType="fade">
        <View style={styles.spinnerOverlay}>
          <View style={[styles.spinnerContainer, { backgroundColor: colors.card }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.spinnerText, { color: colors.text }]}>
              {spinnerMessage}
            </Text>
          </View>
        </View>
      </Modal>

      {habits.length === 0 ? (
        <EmptyState
          icon="fitness"
          title="Aucune habitude"
          message="Créez vos habitudes quotidiennes"
          actionLabel="Créer"
          onAction={() => openHabitForm()}
        />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
          }
          renderItem={({ item }) => {
            const completed = isHabitCompleted(item.id);
            return (
              <View
                style={[
                  styles.habitCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.habitMain}
                  onPress={() => toggleHabit(item.id)}
                  onLongPress={() => openHabitForm(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.habitIcon, { backgroundColor: item.color + '20' }]}>
                    <Text style={styles.habitEmoji}>{item.icon || '🎯'}</Text>
                  </View>
                  <View style={styles.habitContent}>
                    <Text style={[styles.habitName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.habitDesc, { color: colors.textSecondary }]}>
                      {item.frequency === 'daily' ? 'Quotidienne' : item.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'}
                    </Text>
                  </View>
                  <Ionicons
                    name={completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={32}
                    color={completed ? colors.success : colors.textSecondary}
                  />
                </TouchableOpacity>
                
                {/* BOUTONS D'ACTION */}
                <View style={styles.habitActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.surface }]}
                    onPress={() => openHabitForm(item.id)}
                  >
                    <Ionicons name="create-outline" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.surface }]}
                    onPress={() => deleteHabit(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* BOUTON FLOTTANT */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => openHabitForm()}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* BOTTOMSHEET FORMULAIRE */}
      <BottomSheet ref={bottomSheetRef} snapPoint={0.85}>
        <HabitForm
          habitId={editingHabitId}
          onClose={closeHabitForm}
          onSuccess={loadData}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.sm,
  },
  habitCard: {
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    overflow: 'hidden',
  },
  habitMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitEmoji: {
    fontSize: 24,
  },
  habitContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  habitName: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitDesc: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
  habitActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
    padding: SPACING.xs,
    paddingTop: 0,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  fab: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});