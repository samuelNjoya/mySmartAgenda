/**
 * Palette de couleurs pour l'application
 * Thèmes clair et sombre + couleurs de catégories
 */

export const COLORS = {
  // ==================== THÈME CLAIR ====================
  light: {
    primary: '#3B82F6',      // Bleu principal
    secondary: '#8B5CF6',    // Violet
    accent: '#10B981',       // Vert
    background: '#FFFFFF',   // Fond blanc
    surface: '#F9FAFB',      // Surface gris très clair
    card: '#FFFFFF',         // Fond des cartes
    text: '#111827',         // Texte principal
    textSecondary: '#6B7280', // Texte secondaire
    border: '#E5E7EB',       // Bordures
    error: '#EF4444',        // Erreur rouge
    warning: '#F59E0B',      // Avertissement orange
    success: '#10B981',      // Succès vert
    info: '#3B82F6',         // Info bleu
    disabled: '#D1D5DB',     // Désactivé gris
    shadow: 'rgba(0, 0, 0, 0.1)', // Ombre
  },
  
  // ==================== THÈME SOMBRE ====================
  dark: {
    primary: '#60A5FA',      // Bleu clair
    secondary: '#A78BFA',    // Violet clair
    accent: '#34D399',       // Vert clair
    background: '#111827',   // Fond noir-bleu
    surface: '#1F2937',      // Surface gris foncé
    card: '#1F2937',         // Fond des cartes
    text: '#F9FAFB',         // Texte clair
    textSecondary: '#9CA3AF', // Texte secondaire
    border: '#374151',       // Bordures foncées
    error: '#F87171',        // Erreur rouge clair
    warning: '#FBBF24',      // Avertissement orange clair
    success: '#34D399',      // Succès vert clair
    info: '#60A5FA',         // Info bleu clair
    disabled: '#4B5563',     // Désactivé gris foncé
    shadow: 'rgba(0, 0, 0, 0.3)', // Ombre plus forte
  },

  // ==================== CATÉGORIES PRÉDÉFINIES ====================
  categories: {
    work: '#3B82F6',         // Travail - Bleu
    personal: '#10B981',     // Personnel - Vert
    health: '#EF4444',       // Santé - Rouge
    study: '#8B5CF6',        // Études - Violet
    family: '#F59E0B',       // Famille - Orange
    finance: '#059669',      // Finance - Vert foncé
    travel: '#06B6D4',       // Voyage - Cyan
    entertainment: '#EC4899', // Divertissement - Rose
    sport: '#14B8A6',        // Sport - Turquoise
    shopping: '#A855F7',     // Shopping - Violet
    food: '#F97316',         // Nourriture - Orange vif
    other: '#6B7280',        // Autre - Gris
  },

  // ==================== PRIORITÉS DES TÂCHES ====================
  priority: {
    low: '#9CA3AF',          // Basse - Gris
    normal: '#3B82F6',       // Normale - Bleu
    high: '#F59E0B',         // Haute - Orange
    urgent: '#EF4444',       // Urgente - Rouge
  },

  // ==================== STATUTS ====================
  status: {
    pending: '#F59E0B',      // En attente
    inProgress: '#3B82F6',   // En cours
    completed: '#10B981',    // Terminé
    cancelled: '#6B7280',    // Annulé
  },

  // ==================== GRADIENTS ====================
  gradients: {
    primary: ['#3B82F6', '#2563EB'],
    secondary: ['#8B5CF6', '#7C3AED'],
    success: ['#10B981', '#059669'],
    warning: ['#F59E0B', '#D97706'],
    error: ['#EF4444', '#DC2626'],
    sunset: ['#F59E0B', '#EF4444'],
    ocean: ['#06B6D4', '#3B82F6'],
    forest: ['#10B981', '#059669'],
    purple: ['#A78BFA', '#8B5CF6'],
  },

  // ==================== COULEURS TRANSPARENTES ====================
  transparent: {
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black30: 'rgba(0, 0, 0, 0.3)',
    black50: 'rgba(0, 0, 0, 0.5)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white30: 'rgba(255, 255, 255, 0.3)',
    white50: 'rgba(255, 255, 255, 0.5)',
  },
};

// ==================== FONCTION UTILITAIRE ====================

/**
 * Obtient la couleur selon le thème actuel
 */
export const getThemedColor = (
  theme: 'light' | 'dark',
  colorKey: keyof typeof COLORS.light
) => {
  return COLORS[theme][colorKey];
};

/**
 * Obtient la couleur d'une catégorie
 */
export const getCategoryColor = (category: keyof typeof COLORS.categories) => {
  return COLORS.categories[category] || COLORS.categories.other;
};

/**
 * Obtient la couleur d'une priorité
 */
export const getPriorityColor = (priority: keyof typeof COLORS.priority) => {
  return COLORS.priority[priority] || COLORS.priority.normal;
};
