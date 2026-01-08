/**
 * Écran Notes COMPLET
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
import { Note } from '../../../types';
import { Spinner, EmptyState, BottomSheet, BottomSheetRef } from '../../../components/common';
import Toast from 'react-native-toast-message';

// Import du formulaire
import { NoteForm } from './NoteForm';

export function NotesScreen() {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | undefined>();
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState('');

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

  function openNoteForm(noteId?: string) {
    setEditingNoteId(noteId);
    bottomSheetRef.current?.open();
  }

  async function closeNoteForm() {
    bottomSheetRef.current?.close();
    setEditingNoteId(undefined);
    await loadNotes();
  }

  async function deleteNote(noteId: string) {
    Alert.alert(
      'Supprimer la note',
      'Voulez-vous vraiment supprimer cette note ?',
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

              await softDelete(STORAGE_KEYS.NOTES, noteId);
              await loadNotes();
              
              setShowSpinner(false);
              
              Toast.show({
                type: 'success',
                text1: '🗑️ Note supprimée',
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

  async function toggleFavorite(noteId: string) {
    try {
      // SPINNER AVANT TOUT
      setSpinnerMessage('Mise à jour...');
      setShowSpinner(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));

      const allNotes = (await storage.get<Note[]>(STORAGE_KEYS.NOTES)) || [];
      const note = allNotes.find((n) => n.id === noteId);
      
      if (note) {
        note.favorite = !note.favorite;
        note.updatedAt = new Date();
        await storage.save(STORAGE_KEYS.NOTES, allNotes);
        await loadNotes();
      }
      
      setShowSpinner(false);
      
      Toast.show({
        type: 'success',
        text1: note?.favorite ? '⭐ Note mise en favori' : '✅ Favori retiré',
      });
    } catch (error) {
      setShowSpinner(false);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
      });
    }
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

      {notes.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="Aucune note"
          message="Créez votre première note"
          actionLabel="Créer"
          onAction={() => openNoteForm()}
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
            <View
              style={[
                styles.noteCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                style={styles.noteMain}
                onPress={() => openNoteForm(item.id)}
                onLongPress={() => openNoteForm(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.noteHeader}>
                  <Text style={[styles.noteTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Ionicons 
                      name={item.favorite ? 'star' : 'star-outline'} 
                      size={20} 
                      color={item.favorite ? '#F59E0B' : colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.content}
                </Text>
                {item.tags && item.tags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {item.tags.slice(0, 3).map((tag) => (
                      <View key={tag} style={[styles.tag, { backgroundColor: colors.primary + '15' }]}>
                        <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                      </View>
                    ))}
                    {item.tags.length > 3 && (
                      <Text style={[styles.moreText, { color: colors.textSecondary }]}>
                        +{item.tags.length - 3}
                      </Text>
                    )}
                  </View>
                )}
                <Text style={[styles.noteDate, { color: colors.textSecondary }]}>
                  {formatDate(new Date(item.updatedAt), 'PP')}
                </Text>
              </TouchableOpacity>
              
              {/* BOUTONS D'ACTION */}
              <View style={styles.noteActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.surface }]}
                  onPress={() => openNoteForm(item.id)}
                >
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.surface }]}
                  onPress={() => deleteNote(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* BOUTON FLOTTANT */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => openNoteForm()}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* BOTTOMSHEET FORMULAIRE */}
      <BottomSheet ref={bottomSheetRef} snapPoint={0.85}>
        <NoteForm
          noteId={editingNoteId}
          onClose={closeNoteForm}
          onSuccess={loadNotes}
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
  noteCard: {
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    overflow: 'hidden',
  },
  noteMain: {
    padding: SPACING.sm,
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
    marginRight: SPACING.xs,
  },
  noteContent: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: 18,
    marginBottom: SPACING.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    fontSize: TYPOGRAPHY.tiny.fontSize,
    fontWeight: '600',
  },
  moreText: {
    fontSize: TYPOGRAPHY.tiny.fontSize,
  },
  noteDate: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
  noteActions: {
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