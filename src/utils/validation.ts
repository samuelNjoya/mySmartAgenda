/**
 * Utilitaires de validation des données
 * Validation robuste pour tous les formulaires
 */

import { ValidationError } from '../types';

// ==================== VALIDATION DES ÉVÉNEMENTS ====================

export interface EventValidationInput {
  title: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
}

/**
 * Valide les données d'un événement
 */
export function validateEvent(data: EventValidationInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Titre obligatoire
  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Le titre est obligatoire',
    });
  }

  // Titre pas trop long
  if (data.title && data.title.length > 100) {
    errors.push({
      field: 'title',
      message: 'Le titre ne peut pas dépasser 100 caractères',
    });
  }

  // Date de début obligatoire
  if (!data.startDate) {
    errors.push({
      field: 'startDate',
      message: 'La date de début est obligatoire',
    });
  }

  // Date de fin obligatoire
  if (!data.endDate) {
    errors.push({
      field: 'endDate',
      message: 'La date de fin est obligatoire',
    });
  }

  // Date de fin après date de début
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    errors.push({
      field: 'endDate',
      message: 'La date de fin doit être après la date de début',
    });
  }

  return errors;
}

// ==================== VALIDATION DES TÂCHES ====================

export interface TaskValidationInput {
  title: string;
  dueDate?: Date;
  dueTime?: string;
}

/**
 * Valide les données d'une tâche
 */
export function validateTask(data: TaskValidationInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Titre obligatoire
  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Le titre est obligatoire',
    });
  }

  // Titre pas trop long
  if (data.title && data.title.length > 200) {
    errors.push({
      field: 'title',
      message: 'Le titre ne peut pas dépasser 200 caractères',
    });
  }

  // Validation du format de l'heure (HH:mm)
  if (data.dueTime) {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.dueTime)) {
      errors.push({
        field: 'dueTime',
        message: 'Format d\'heure invalide (utilisez HH:mm)',
      });
    }
  }

  return errors;
}

// ==================== VALIDATION DES HABITUDES ====================

export interface HabitValidationInput {
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[];
  targetCount?: number;
}

/**
 * Valide les données d'une habitude
 */
export function validateHabit(data: HabitValidationInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Nom obligatoire
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Le nom est obligatoire',
    });
  }

  // Nom pas trop long
  if (data.name && data.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Le nom ne peut pas dépasser 100 caractères',
    });
  }

  // Fréquence obligatoire
  if (!data.frequency) {
    errors.push({
      field: 'frequency',
      message: 'La fréquence est obligatoire',
    });
  }

  // Jours de la semaine pour fréquence hebdomadaire
  if (data.frequency === 'weekly') {
    if (!data.daysOfWeek || data.daysOfWeek.length === 0) {
      errors.push({
        field: 'daysOfWeek',
        message: 'Sélectionnez au moins un jour de la semaine',
      });
    }
  }

  // Target count doit être positif
  if (data.targetCount !== undefined && data.targetCount <= 0) {
    errors.push({
      field: 'targetCount',
      message: 'L\'objectif doit être supérieur à 0',
    });
  }

  return errors;
}

// ==================== VALIDATION DES NOTES ====================

export interface NoteValidationInput {
  title: string;
  content: string;
}

/**
 * Valide les données d'une note
 */
export function validateNote(data: NoteValidationInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Titre obligatoire
  if (!data.title || data.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Le titre est obligatoire',
    });
  }

  // Titre pas trop long
  if (data.title && data.title.length > 200) {
    errors.push({
      field: 'title',
      message: 'Le titre ne peut pas dépasser 200 caractères',
    });
  }

  // Contenu obligatoire
  if (!data.content || data.content.trim().length === 0) {
    errors.push({
      field: 'content',
      message: 'Le contenu est obligatoire',
    });
  }

  return errors;
}

// ==================== VALIDATION DU CODE PIN ====================

/**
 * Valide un code PIN
 */
export function validatePinCode(pin: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // PIN obligatoire
  if (!pin || pin.length === 0) {
    errors.push({
      field: 'pin',
      message: 'Le code PIN est obligatoire',
    });
  }

  // PIN doit contenir exactement 4 chiffres
  if (pin && pin.length !== 4) {
    errors.push({
      field: 'pin',
      message: 'Le code PIN doit contenir 4 chiffres',
    });
  }

  // PIN ne doit contenir que des chiffres
  if (pin && !/^\d+$/.test(pin)) {
    errors.push({
      field: 'pin',
      message: 'Le code PIN ne doit contenir que des chiffres',
    });
  }

  return errors;
}

// ==================== VALIDATION EMAIL ====================

/**
 * Valide un email
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==================== UTILITAIRES ====================

/**
 * Vérifie si une liste d'erreurs est vide
 */
export function hasErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

/**
 * Obtient le premier message d'erreur pour un champ
 */
export function getErrorMessage(
  errors: ValidationError[],
  field: string
): string | undefined {
  const error = errors.find((e) => e.field === field);
  return error?.message;
}

/**
 * Formate une liste d'erreurs en un seul message
 */
export function formatErrors(errors: ValidationError[]): string {
  return errors.map((e) => e.message).join('\n');
}
