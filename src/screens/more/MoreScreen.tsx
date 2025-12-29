/**
 * Écran Plus
 * Hub pour toutes les fonctionnalités avancées
 */

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/Sizes';
import { Card } from '../../components/common';

// ==================== TYPES ====================

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  screen: string;
}

// ==================== COMPOSANT PRINCIPAL ====================

export function MoreScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const features: Feature[] = [
    {
      id: 'habits',
      title: 'Habitudes',
      description: 'Suivez vos habitudes quotidiennes',
      icon: 'fitness',
      color: '#10B981',
      screen: 'Habits',
    },
    {
      id: 'notes',
      title: 'Notes',
      description: 'Créez et organisez vos notes',
      icon: 'document-text',
      color: '#F59E0B',
      screen: 'Notes',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Visualisez vos statistiques',
      icon: 'bar-chart',
      color: '#8B5CF6',
      screen: 'Analytics',
    },
    {
      id: 'pomodoro',
      title: 'Pomodoro',
      description: 'Timer de productivité',
      icon: 'timer',
      color: '#EF4444',
      screen: 'Pomodoro',
    },
  ];

  /**
   * Navigation vers une fonctionnalité
   */
  function navigateTo(screen: string) {
    navigation.navigate(screen);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Fonctionnalités
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Explorez toutes les fonctionnalités avancées
          </Text>
        </View>

        {/* Grille de fonctionnalités */}
        <View style={styles.grid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => navigateTo(feature.screen)}
              activeOpacity={0.7}
            >
              <Card
                variant="elevated"
                style={[styles.featureCardInner, { backgroundColor: colors.card }]}
              >
                {/* Icône */}
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: feature.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={feature.icon}
                    size={32}
                    color={feature.color}
                  />
                </View>

                {/* Contenu */}
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>

                {/* Flèche */}
                <View style={styles.arrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={colors.primary}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section bientôt disponible */}
        <View style={styles.comingSoon}>
          <Text style={[styles.comingSoonTitle, { color: colors.text }]}>
            Bientôt disponible
          </Text>

          <Card variant="outlined">
            <View style={styles.comingSoonItem}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.textSecondary}
              />
              <View style={styles.comingSoonContent}>
                <Text style={[styles.comingSoonItemTitle, { color: colors.text }]}>
                  Routines
                </Text>
                <Text
                  style={[
                    styles.comingSoonItemDesc,
                    { color: colors.textSecondary },
                  ]}
                >
                  Créez des routines matinales et nocturnes
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="outlined">
            <View style={styles.comingSoonItem}>
              <Ionicons
                name="people-outline"
                size={24}
                color={colors.textSecondary}
              />
              <View style={styles.comingSoonContent}>
                <Text style={[styles.comingSoonItemTitle, { color: colors.text }]}>
                  Collaboration
                </Text>
                <Text
                  style={[
                    styles.comingSoonItemDesc,
                    { color: colors.textSecondary },
                  ]}
                >
                  Partagez des événements avec d'autres
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="outlined">
            <View style={styles.comingSoonItem}>
              <Ionicons
                name="sync-outline"
                size={24}
                color={colors.textSecondary}
              />
              <View style={styles.comingSoonContent}>
                <Text style={[styles.comingSoonItemTitle, { color: colors.text }]}>
                  Synchronisation Cloud
                </Text>
                <Text
                  style={[
                    styles.comingSoonItemDesc,
                    { color: colors.textSecondary },
                  ]}
                >
                  Synchronisez vos données entre appareils
                </Text>
              </View>
            </View>
          </Card>
        </View>
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
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  featureCard: {
    width: '50%',
    padding: SPACING.xs,
  },
  featureCardInner: {
    height: 180,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.h4.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  arrow: {
    alignSelf: 'flex-end',
  },
  comingSoon: {
    marginTop: SPACING.xl,
  },
  comingSoonTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  comingSoonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comingSoonContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  comingSoonItemTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  comingSoonItemDesc: {
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
});
