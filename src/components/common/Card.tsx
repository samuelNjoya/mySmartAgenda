/**
 * Composant Card réutilisable
 * Pour afficher du contenu dans des cartes élégantes
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/Sizes';

// ==================== TYPES ====================

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'outlined' | 'elevated';
}

// ==================== COMPOSANT ====================

export function Card({ children, onPress, style, variant = 'default' }: CardProps) {
  const { colors } = useTheme();

  // ==================== STYLES DYNAMIQUES ====================

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: colors.card,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'elevated':
        return {
          ...baseStyle,
          ...SHADOWS.medium,
        };
      default:
        return baseStyle;
    }
  };

  // ==================== RENDER ====================

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
});
