/**
 * Composant EmptyState
 * Affiche un message quand il n'y a pas de données
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../../constants/Sizes';
import { Button } from './Button';

// ==================== TYPES ====================

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// ==================== COMPOSANT ====================

export function EmptyState({
  icon = 'folder-open-outline',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Icône */}
      <Ionicons name={icon} size={64} color={colors.textSecondary} />

      {/* Titre */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {/* Message */}
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}

      {/* Action button */}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '600',
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: SPACING.lg,
  },
});
