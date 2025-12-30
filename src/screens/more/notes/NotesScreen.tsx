/**
 * Écran Notes
 * Gestion des notes personnelles
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/Sizes';
import { formatDate } from '../../../utils/dateHelpers';
import { storage, STORAGE_KEYS } from '../../../services/storage';
import { Note } from '../../../types';
import { Spinner, EmptyState } from '../../../components/common';
import Toast from 'react-native-toast-message';

export function NotesScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  async function loadNotes() {
    try {
      setLoading(true);
      const allNotes = (await storage.get<Note[]>(STORAGE_KEYS.NOTES)) || [];
      const activeNotes = allNotes.filter((n) => !n.deletedAt);
      setNotes(activeNotes.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les notes',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {notes.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="Aucune note"
          message="Créez votre première note"
        />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={() => { setRefreshing(true); loadNotes(); }} 
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.noteCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.noteHeader}>
                <Text style={[styles.noteTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.favorite && (
                  <Ionicons name="star" size={16} color="#F59E0B" />
                )}
              </View>
              <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.content}
              </Text>
              <Text style={[styles.noteDate, { color: colors.textSecondary }]}>
                {formatDate(new Date(item.updatedAt), 'PP')}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.sm,
  },
  noteCard: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  noteTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    flex: 1,
  },
  noteContent: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  noteDate: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
});
