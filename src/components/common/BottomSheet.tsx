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

        {/* BottomSheet */}
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

          {/* Contenu */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    );
  }
);

// ==================== STYLES ====================

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
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
  contentContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
});
