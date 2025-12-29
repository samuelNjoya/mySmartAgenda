/**
 * Écran Paramètres
 * Configuration de l'application incluant le code PIN
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/Sizes';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { validatePinCode, hasErrors } from '../../utils/validation';
import { Settings } from '../../types';
import { Card, Input, Button } from '../../components/common';
import Toast from 'react-native-toast-message';

// ==================== COMPOSANT PRINCIPAL ====================

export function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // ==================== EFFETS ====================

  useEffect(() => {
    loadSettings();
  }, []);

  // ==================== FONCTIONS ====================

  /**
   * Charge les paramètres
   */
  async function loadSettings() {
    try {
      const savedSettings = await storage.get<Settings>(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings(savedSettings);
        setPinEnabled(savedSettings.security?.pinEnabled || false);
      } else {
        // Créer des paramètres par défaut
        const defaultSettings: Settings = {
          userId: 'user_1',
          profile: {
            name: 'Utilisateur',
          },
          appearance: {
            theme: 'auto',
            primaryColor: '#3B82F6',
            accentColor: '#10B981',
            fontSize: 'medium',
          },
          calendar: {
            firstDayOfWeek: 1,
            defaultView: 'month',
            timeFormat: '24h',
            dateFormat: 'dd/MM/yyyy',
          },
          notifications: {
            enabled: true,
            events: true,
            tasks: true,
            habits: true,
            sound: true,
            vibrate: true,
          },
          security: {
            pinEnabled: false,
            autoLockMinutes: 5,
          },
          backup: {
            autoBackup: true,
            frequency: 'daily',
          },
        };
        await storage.save(STORAGE_KEYS.SETTINGS, defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  }

  /**
   * Active/Désactive le code PIN
   */
  async function togglePin(value: boolean) {
    if (value) {
      // Activer : afficher le setup
      setShowPinSetup(true);
    } else {
      // Désactiver : demander confirmation
      Alert.alert(
        'Désactiver le code PIN',
        'Êtes-vous sûr de vouloir désactiver la protection par code PIN ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Désactiver',
            style: 'destructive',
            onPress: async () => {
              try {
                const updatedSettings = {
                  ...settings,
                  security: {
                    ...settings?.security,
                    pinEnabled: false,
                    pinCode: undefined,
                  },
                };
                await storage.save(STORAGE_KEYS.SETTINGS, updatedSettings);
                setSettings(updatedSettings);
                setPinEnabled(false);
                Toast.show({
                  type: 'success',
                  text1: 'Code PIN désactivé',
                });
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: 'Erreur',
                  text2: 'Impossible de désactiver le code PIN',
                });
              }
            },
          },
        ]
      );
    }
  }

  /**
   * Sauvegarde le nouveau code PIN
   */
  async function savePinCode() {
    // Validation
    const errors = validatePinCode(newPin);
    if (hasErrors(errors)) {
      Toast.show({
        type: 'error',
        text1: 'Code PIN invalide',
        text2: 'Le code PIN doit contenir exactement 4 chiffres',
      });
      return;
    }

    // Vérifier la confirmation
    if (newPin !== confirmPin) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Les codes PIN ne correspondent pas',
      });
      return;
    }

    try {
      // Sauvegarder (en production, il faudrait hasher le PIN)
      const updatedSettings = {
        ...settings,
        security: {
          ...settings?.security,
          pinEnabled: true,
          pinCode: newPin, // ATTENTION: En production, hasher le PIN !
        },
      };
      await storage.save(STORAGE_KEYS.SETTINGS, updatedSettings);
      setSettings(updatedSettings);
      setPinEnabled(true);
      setShowPinSetup(false);
      setNewPin('');
      setConfirmPin('');
      
      Toast.show({
        type: 'success',
        text1: 'Code PIN activé',
        text2: 'Votre application est maintenant protégée',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de sauvegarder le code PIN',
      });
    }
  }

  /**
   * Modifier le code PIN
   */
  function handleChangePin() {
    setShowPinSetup(true);
    setNewPin('');
    setConfirmPin('');
  }

  // ==================== RENDER ====================

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section Apparence */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Apparence
        </Text>

        <Card variant="outlined">
          <TouchableOpacity
            style={styles.settingItem}
            onPress={toggleTheme}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name={theme === 'dark' ? 'moon' : 'sunny'}
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Thème sombre
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.disabled, true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </TouchableOpacity>
        </Card>

        {/* Section Sécurité */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Sécurité
        </Text>

        <Card variant="outlined">
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="lock-closed"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Code PIN
              </Text>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={togglePin}
              trackColor={{ false: colors.disabled, true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          {pinEnabled && !showPinSetup && (
            <TouchableOpacity
              style={styles.changePinButton}
              onPress={handleChangePin}
            >
              <Text style={[styles.changePinText, { color: colors.primary }]}>
                Modifier le code PIN
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Configuration du PIN */}
        {showPinSetup && (
          <Card variant="elevated" style={styles.pinSetupCard}>
            <Text style={[styles.pinSetupTitle, { color: colors.text }]}>
              {pinEnabled ? 'Modifier le code PIN' : 'Configurer le code PIN'}
            </Text>

            <Input
              label="Nouveau code PIN"
              placeholder="Entrez 4 chiffres"
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              icon="lock-closed-outline"
            />

            <Input
              label="Confirmer le code PIN"
              placeholder="Confirmez le code PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              icon="lock-closed-outline"
            />

            <View style={styles.pinSetupActions}>
              <Button
                title="Annuler"
                onPress={() => {
                  setShowPinSetup(false);
                  setNewPin('');
                  setConfirmPin('');
                  if (!pinEnabled) {
                    setPinEnabled(false);
                  }
                }}
                variant="outline"
                style={styles.pinActionButton}
              />
              <Button
                title="Enregistrer"
                onPress={savePinCode}
                style={styles.pinActionButton}
              />
            </View>
          </Card>
        )}

        {/* Section À propos */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          À propos
        </Text>

        <Card variant="outlined">
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Version
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
              1.0.0
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '600',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginLeft: SPACING.md,
  },
  settingValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  changePinButton: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  changePinText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  pinSetupCard: {
    marginTop: SPACING.md,
  },
  pinSetupTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  pinSetupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  pinActionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
});
