/**
 * Écran Pomodoro
 * Timer de productivité 25/5 minutes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY } from '../../../constants/Sizes';
import * as Haptics from 'expo-haptics';

export function PomodoroScreen() {
  const { colors } = useTheme();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer terminé
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsRunning(false);
            if (!isBreak) {
              // Passer en pause
              setIsBreak(true);
              setMinutes(5);
              setSeconds(0);
            } else {
              // Retour au travail
              setIsBreak(false);
              setMinutes(25);
              setSeconds(0);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds, isBreak]);

  function toggleTimer() {
    setIsRunning(!isRunning);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function reset() {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Type */}
        <Text style={[styles.type, { color: isBreak ? colors.success : colors.primary }]}>
          {isBreak ? '☕ Pause' : '💪 Travail'}
        </Text>

        {/* Timer */}
        <Text style={[styles.timer, { color: colors.text }]}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </Text>

        {/* Contrôles */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.resetButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={reset}
          >
            <Ionicons name="refresh" size={24} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.mainButton,
              { backgroundColor: isRunning ? colors.error : colors.primary },
            ]}
            onPress={toggleTimer}
          >
            <Ionicons 
              name={isRunning ? 'pause' : 'play'} 
              size={32} 
              color="#FFFFFF" 
            />
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {isRunning ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.skipButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => {
              if (isBreak) {
                setIsBreak(false);
                setMinutes(25);
              } else {
                setIsBreak(true);
                setMinutes(5);
              }
              setSeconds(0);
              setIsRunning(false);
            }}
          >
            <Ionicons name="play-skip-forward" size={24} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Technique Pomodoro : 25 min de travail, 5 min de pause
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  type: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: '700',
    marginBottom: SPACING.xl,
  },
  timer: {
    fontSize: 72,
    fontWeight: '700',
    marginBottom: SPACING.xxxl,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    minWidth: 80,
  },
  mainButton: {
    minWidth: 120,
    paddingVertical: SPACING.lg,
  },
  resetButton: {
    borderWidth: 1,
  },
  skipButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  info: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    textAlign: 'center',
    lineHeight: 20,
  },
});
