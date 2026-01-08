/**
 * Formulaire Note (Composant pour BottomSheet)
 * CRUD complet avec spinner avant toast
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
import { validateNote } from '../../../utils/validation';
import { storage, STORAGE_KEYS, saveItemToList } from '../../../services/storage';
import { Note } from '../../../types';
import { Input, Button } from '../../../components/common';
import Toast from 'react-native-toast-message';

// ==================== PROPS ====================

interface NoteFormProps {
  noteId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ==================== COMPOSANT ====================

export function NoteForm({ noteId, onClose, onSuccess }: NoteFormProps) {
  const { colors } = useTheme();
  const isEditing = !!noteId;

  // États
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadNote();
    }
  }, []);

  async function loadNote() {
    try {
      const notes = (await storage.get<Note[]>(STORAGE_KEYS.NOTES)) || [];
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setFavorite(note.favorite);
        setTags(note.tags || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  async function handleSave() {
    try {
      // 1. SPINNER AVANT TOUT
      setShowSpinner(true);
      setSaving(true);

      // Petite pause pour que le spinner soit visible
      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. VALIDATION
      const errors = validateNote({ title, content });
      if (errors.length > 0) {
        setShowSpinner(false);
        Toast.show({
          type: 'error',
          text1: errors[0].message,
        });
        setSaving(false);
        return;
      }

      // 3. SAUVEGARDE
      const note: Note = {
        id: noteId || `note_${Date.now()}`,
        title,
        content,
        favorite,
        tags,
        createdAt: isEditing ? (await getOriginalCreatedAt()) : new Date(),
        updatedAt: new Date(),
      };

      await saveItemToList(STORAGE_KEYS.NOTES, note);

      // 4. CACHER LE SPINNER
      setShowSpinner(false);

      // 5. TOAST DE SUCCÈS
      Toast.show({
        type: 'success',
        text1: isEditing ? '✅ Note modifiée' : '✅ Note créée',
      });

      // 6. CALLBACK ET FERMETURE
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

  async function getOriginalCreatedAt(): Promise<Date> {
    try {
      const notes = (await storage.get<Note[]>(STORAGE_KEYS.NOTES)) || [];
      const note = notes.find((n) => n.id === noteId);
      return note?.createdAt || new Date();
    } catch {
      return new Date();
    }
  }

  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <View style={styles.container}>
      {/* SPINNER OVERLAY */}
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

      {/* TITRE */}
      <View style={styles.titleRow}>
        <Text style={[styles.header, { color: colors.text }]}>
          {isEditing ? 'Modifier la note' : 'Nouvelle note'}
        </Text>
        <TouchableOpacity onPress={() => setFavorite(!favorite)}>
          <Ionicons
            name={favorite ? 'star' : 'star-outline'}
            size={28}
            color={favorite ? '#F59E0B' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* TITRE NOTE */}
      <Input
        label="Titre"
        placeholder="Titre de la note"
        value={title}
        onChangeText={setTitle}
        required
      />

      {/* CONTENU */}
      <Input
        label="Contenu"
        placeholder="Écrivez votre note ici..."
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={8}
        required
      />

      {/* TAGS */}
      <Text style={[styles.label, { color: colors.text }]}>Tags</Text>
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, { backgroundColor: colors.primary + '20' }]}
              onPress={() => removeTag(tag)}
            >
              <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
              <Ionicons name="close-circle" size={16} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* AJOUTER TAG */}
      <View style={styles.addTagRow}>
        <Input
          placeholder="Ajouter un tag"
          value={newTag}
          onChangeText={setNewTag}
          containerStyle={{ flex: 1, marginBottom: 0 }}
          onSubmitEditing={addTag}
        />
        <Button title="+" onPress={addTag} size="small" style={styles.addButton} />
      </View>

      {/* ACTIONS */}
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

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.md,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '700',
  },
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
  },
  tagText: {
    fontSize: TYPOGRAPHY.small.fontSize,
    fontWeight: '600',
  },
  addTagRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  addButton: {
    minWidth: 50,
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
