/**
 * CategoryPicker - Sélecteur de catégorie professionnel
 * 
 * CORRECTION: Modal élégant avec vraies icônes Ionicons
 * Plus de ScrollView horizontal amateur - un vrai sélecteur pro
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { Category } from '../../types';

interface CategoryPickerProps {
  visible: boolean;
  categories: Category[];
  selectedId: string;
  onSelect: (categoryId: string) => void;
  onClose: () => void;
}

export function CategoryPicker({
  visible,
  categories,
  selectedId,
  onSelect,
  onClose,
}: CategoryPickerProps) {
  const { colors } = useTheme();

  function handleSelect(categoryId: string) {
    onSelect(categoryId);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Modal Container */}
        <View style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modal, { backgroundColor: colors.card }]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Choisir une catégorie
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Liste des catégories */}
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor:
                        selectedId === item.id ? item.color + '15' : 'transparent',
                      borderColor:
                        selectedId === item.id ? item.color : colors.border,
                    },
                  ]}
                  onPress={() => handleSelect(item.id)}
                >
                  {/* Icône Ionicons (plus d'emojis) */}
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.color + '20' },
                    ]}
                  >
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>

                  {/* Nom */}
                  <Text
                    style={[
                      styles.categoryName,
                      {
                        color: selectedId === item.id ? item.color : colors.text,
                        fontWeight: selectedId === item.id ? '600' : '400',
                      },
                    ]}
                  >
                    {item.name}
                  </Text>

                  {/* Checkmark si sélectionné */}
                  {selectedId === item.id && (
                    <Ionicons name="checkmark-circle" size={22} color={item.color} />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
  },
  modal: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '700',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  listContent: {
    padding: SPACING.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  categoryName: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
});