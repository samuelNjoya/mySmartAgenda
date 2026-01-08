/**
 * CORRECTION 2: Catégories par Défaut
 * 
 * Système de catégories pour événements et habitudes
 * CORRECTION: Utilise des icônes Ionicons au lieu d'emojis (professionnels)
 * Plus d'emojis dans le code - que des vraies icônes
 */

import { Category } from '../types';

// ==================== CATÉGORIES ÉVÉNEMENTS ====================

export const EVENT_CATEGORIES: Category[] = [
  {
    id: 'event_work',
    name: 'Travail',
    color: '#3B82F6', // Bleu
    icon: 'briefcase', // Ionicons: briefcase
    type: 'event',
    order: 1,
  },
  {
    id: 'event_personal',
    name: 'Personnel',
    color: '#10B981', // Vert
    icon: 'person', // Ionicons: person
    type: 'event',
    order: 2,
  },
  {
    id: 'event_health',
    name: 'Santé',
    color: '#EF4444', // Rouge
    icon: 'medical', // Ionicons: medical
    type: 'event',
    order: 3,
  },
  {
    id: 'event_sport',
    name: 'Sport',
    color: '#F59E0B', // Orange
    icon: 'football', // Ionicons: football
    type: 'event',
    order: 4,
  },
  {
    id: 'event_social',
    name: 'Social',
    color: '#EC4899', // Rose
    icon: 'people', // Ionicons: people
    type: 'event',
    order: 5,
  },
  {
    id: 'event_family',
    name: 'Famille',
    color: '#8B5CF6', // Violet
    icon: 'home', // Ionicons: home
    type: 'event',
    order: 6,
  },
  {
    id: 'event_education',
    name: 'Éducation',
    color: '#06B6D4', // Cyan
    icon: 'school', // Ionicons: school
    type: 'event',
    order: 7,
  },
  {
    id: 'event_travel',
    name: 'Voyage',
    color: '#84CC16', // Lime
    icon: 'airplane', // Ionicons: airplane
    type: 'event',
    order: 8,
  },
  {
    id: 'habit_other',
    name: 'Autre',
    color: '#6B7280', // Gris neutre
    icon: 'ellipse', // Cercle simple
    type: 'habit',
    order: 9,
  },
];

// ==================== CATÉGORIES HABITUDES ====================

export const HABIT_CATEGORIES: Category[] = [
  {
    id: 'habit_health',
    name: 'Santé',
    color: '#10B981', // Vert
    icon: 'fitness', // Ionicons: fitness
    type: 'habit',
    order: 1,
  },
  {
    id: 'habit_sport',
    name: 'Sport',
    color: '#F59E0B', // Orange
    icon: 'barbell', // Ionicons: barbell
    type: 'habit',
    order: 2,
  },
  {
    id: 'habit_mindfulness',
    name: 'Bien-être',
    color: '#8B5CF6', // Violet
    icon: 'flower', // Ionicons: flower
    type: 'habit',
    order: 3,
  },
  {
    id: 'habit_learning',
    name: 'Apprentissage',
    color: '#3B82F6', // Bleu
    icon: 'book', // Ionicons: book
    type: 'habit',
    order: 4,
  },
  {
    id: 'habit_productivity',
    name: 'Productivité',
    color: '#EF4444', // Rouge
    icon: 'rocket', // Ionicons: rocket
    type: 'habit',
    order: 5,
  },
  {
    id: 'habit_nutrition',
    name: 'Nutrition',
    color: '#84CC16', // Lime
    icon: 'restaurant', // Ionicons: restaurant
    type: 'habit',
    order: 6,
  },
  {
    id: 'habit_sleep',
    name: 'Sommeil',
    color: '#06B6D4', // Cyan
    icon: 'moon', // Ionicons: moon
    type: 'habit',
    order: 7,
  },
  {
    id: 'habit_social',
    name: 'Social',
    color: '#EC4899', // Rose
    icon: 'chatbubbles', // Ionicons: chatbubbles
    type: 'habit',
    order: 8,
  },
  {
    id: 'habit_other',
    name: 'Autre',
    color: '#6B7280', // Gris neutre
    icon: 'ellipse', // Cercle simple
    type: 'habit',
    order: 9,
  },
];

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Obtenir une catégorie par ID
 */
export function getCategoryById(
  id: string,
  type: 'event' | 'habit'
): Category | undefined {
  const categories = type === 'event' ? EVENT_CATEGORIES : HABIT_CATEGORIES;
  return categories.find((c) => c.id === id);
}

/**
 * Obtenir toutes les catégories d'un type
 */
export function getCategoriesByType(type: 'event' | 'habit'): Category[] {
  return type === 'event' ? EVENT_CATEGORIES : HABIT_CATEGORIES;
}

/**
 * Obtenir la couleur d'une catégorie
 */
export function getCategoryColor(
  categoryId: string | undefined,
  type: 'event' | 'habit'
): string {
  if (!categoryId) {
    // Couleur par défaut si pas de catégorie
    return type === 'event' ? '#3B82F6' : '#10B981';
  }
  const category = getCategoryById(categoryId, type);
  return category?.color || '#3B82F6';
}

/**
 * Obtenir l'icône d'une catégorie (nom Ionicons)
 */
export function getCategoryIcon(
  categoryId: string | undefined,
  type: 'event' | 'habit'
): string {
  if (!categoryId) {
    // Icône par défaut si pas de catégorie
    return type === 'event' ? 'calendar' : 'checkmark-circle';
  }
  const category = getCategoryById(categoryId, type);
  return category?.icon || 'calendar';
}

/**
 * Obtenir le nom d'une catégorie
 */
export function getCategoryName(
  categoryId: string | undefined,
  type: 'event' | 'habit'
): string {
  if (!categoryId) {
    return 'Sans catégorie';
  }
  const category = getCategoryById(categoryId, type);
  return category?.name || 'Sans catégorie';
}