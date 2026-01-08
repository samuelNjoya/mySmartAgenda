/**
 * Composant BottomSheet réutilisable
 * Pour tous les formulaires de l'application
 */

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, BORDER_RADIUS } from '../../constants/Sizes';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ==================== TYPES ====================

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoint?: number; // Hauteur en % de l'écran
}

// ==================== COMPOSANT ====================

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, snapPoint = 0.9 }, ref) => {
    const { colors } = useTheme();
    const [visible, setVisible] = useState(false);
    const translateY = useState(new Animated.Value(SCREEN_HEIGHT))[0];

    // ==================== MÉTHODES PUBLIQUES ====================

    useImperativeHandle(ref, () => ({
      open: () => {
        setVisible(true);
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT * (1 - snapPoint),
          useNativeDriver: true,
          damping: 20,
          stiffness: 90,
        }).start();
      },
      close: () => {
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
        });
      },
    }));

    // ==================== GESTES ====================

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(
            SCREEN_HEIGHT * (1 - snapPoint) + gestureState.dy
          );
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Fermer si glissé vers le bas
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            setVisible(false);
          });
        } else {
          // Retourner à la position
          Animated.spring(translateY, {
            toValue: SCREEN_HEIGHT * (1 - snapPoint),
            useNativeDriver: true,
            damping: 20,
            stiffness: 90,
          }).start();
        }
      },
    });

    // ==================== RENDER ====================

    if (!visible) return null;

    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            setVisible(false);
          });
        }}
      >
        {/* Overlay */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => {
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 250,
              useNativeDriver: true,
            }).start(() => {
              setVisible(false);
            });
          }}
        />

        {/* CORRECTION: KeyboardAvoidingView AUTOUR du BottomSheet, pas dedans */}
        {/* Cela permet au sheet de monter avec le clavier au lieu d'être masqué */}
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                backgroundColor: colors.background,
                transform: [{ translateY }],
                height: SCREEN_HEIGHT * snapPoint,
              },
            ]}
          >
            {/* Barre de glissement */}
            <View style={styles.handleContainer} {...panResponder.panHandlers}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
            </View>

            {/* Contenu avec ScrollView */}
            {/* CORRECTION: Padding réduit de SPACING.md (16px) à SPACING.sm (8px) */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

// ==================== STYLES ====================

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998, // Au-dessus de tout sauf le BottomSheet
  },
  // CORRECTION: Style pour KeyboardAvoidingView avec zIndex très élevé
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 9999, // Plus élevé que la TabBar pour être au-dessus
  },
  bottomSheet: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10000, // zIndex le plus élevé pour être au-dessus de TOUT
  },
  handleContainer: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  // CORRECTION: Padding réduit de SPACING.md (16px) à SPACING.sm (8px)
  contentContainer: {
    padding: SPACING.sm, // Était SPACING.md
    paddingBottom: SPACING.lg, // Extra espace pour clavier
  },
});