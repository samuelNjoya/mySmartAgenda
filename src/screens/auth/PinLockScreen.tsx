/**
 * Écran de verrouillage PIN
 * Affiché au démarrage de l'app si le PIN est activé
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { storage, STORAGE_KEYS } from '../../services/storage';
import * as Haptics from 'expo-haptics';

// ==================== TYPES ====================

interface PinLockScreenProps {
  onUnlock: () => void;
}

// ==================== COMPOSANT ====================

export function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [error, setError] = useState('');

  // ==================== EFFETS ====================

  useEffect(() => {
    loadSavedPin();
  }, []);

  // ==================== FONCTIONS ====================

  /**
   * Charge le PIN sauvegardé
   */
  async function loadSavedPin() {
    try {
      const settings = await storage.get(STORAGE_KEYS.SETTINGS);
      if (settings?.security?.pinCode) {
        setSavedPin(settings.security.pinCode);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du PIN:', error);
    }
  }

  /**
   * Ajoute un chiffre au PIN
   */
  function addDigit(digit: string) {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Vérifier automatiquement quand 4 chiffres sont saisis
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  }

  /**
   * Supprime le dernier chiffre
   */
  function removeDigit() {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  /**
   * Vérifie le PIN saisi
   */
  async function verifyPin(enteredPin: string) {
    if (enteredPin === savedPin) {
      // PIN correct
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onUnlock();
    } else {
      // PIN incorrect
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Vibration.vibrate(500);
      setError('Code PIN incorrect');
      setPin('');
    }
  }

  /**
   * Réinitialise le PIN (pour démonstration - en prod, nécessiterait une validation email)
   */
  function handleForgotPin() {
    Alert.alert(
      'Code PIN oublié',
      'Cette fonctionnalité nécessiterait une validation par email en production. Pour cette démo, vous pouvez désactiver le PIN dans les paramètres.',
      [{ text: 'OK' }]
    );
  }

  // ==================== RENDER ====================

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* En-tête */}
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={64} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Entrez votre code PIN
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Saisissez votre code à 4 chiffres
        </Text>
      </View>

      {/* Indicateurs de PIN */}
      <View style={styles.pinIndicators}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              {
                backgroundColor:
                  pin.length > index ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Message d'erreur */}
      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : (
        <View style={styles.errorPlaceholder} />
      )}

      {/* Clavier numérique */}
      <View style={styles.keyboard}>
        {/* Rangée 1 */}
        <View style={styles.row}>
          {[1, 2, 3].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.key,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => addDigit(num.toString())}
            >
              <Text style={[styles.keyText, { color: colors.text }]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rangée 2 */}
        <View style={styles.row}>
          {[4, 5, 6].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.key,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => addDigit(num.toString())}
            >
              <Text style={[styles.keyText, { color: colors.text }]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rangée 3 */}
        <View style={styles.row}>
          {[7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.key,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => addDigit(num.toString())}
            >
              <Text style={[styles.keyText, { color: colors.text }]}>
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rangée 4 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.key, styles.emptyKey]}
            onPress={handleForgotPin}
          >
            <Ionicons name="help-circle-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.key,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => addDigit('0')}
          >
            <Text style={[styles.keyText, { color: colors.text }]}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.key, styles.emptyKey]}
            onPress={removeDigit}
          >
            <Ionicons name="backspace-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: '700',
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginTop: SPACING.sm,
  },
  pinIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: SPACING.sm,
    borderWidth: 2,
  },
  error: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginBottom: SPACING.md,
    minHeight: 20,
  },
  errorPlaceholder: {
    minHeight: 20,
    marginBottom: SPACING.md,
  },
  keyboard: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyKey: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
