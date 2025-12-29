/**
 * Utilitaires pour la manipulation des dates
 */

import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isToday, isTomorrow, isYesterday, isPast, isFuture, differenceInDays, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

// ==================== FORMATAGE ====================

/**
 * Formate une date dans le format spécifié
 */
export function formatDate(date: Date | string, formatStr: string = 'PP'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

/**
 * Formate une date pour l'affichage (ex: "Aujourd'hui", "Hier", "23 déc")
 */
export function formatDisplayDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) return 'Aujourd\'hui';
  if (isTomorrow(dateObj)) return 'Demain';
  if (isYesterday(dateObj)) return 'Hier';
  
  return format(dateObj, 'd MMM', { locale: fr });
}

/**
 * Formate une heure (HH:mm)
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'HH:mm');
}

/**
 * Formate une date complète avec l'heure
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'PPp', { locale: fr });
}

/**
 * Formate le jour de la semaine
 */
export function formatDayOfWeek(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE', { locale: fr });
}

// ==================== MANIPULATION ====================

/**
 * Obtient le début de la semaine pour une date
 */
export function getStartOfWeek(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // Lundi = début
}

/**
 * Obtient la fin de la semaine pour une date
 */
export function getEndOfWeek(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

/**
 * Obtient le début du mois pour une date
 */
export function getStartOfMonth(date: Date = new Date()): Date {
  return startOfMonth(date);
}

/**
 * Obtient la fin du mois pour une date
 */
export function getEndOfMonth(date: Date = new Date()): Date {
  return endOfMonth(date);
}

/**
 * Ajoute des jours à une date
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

/**
 * Obtient tous les jours d'une semaine
 */
export function getDaysOfWeek(date: Date = new Date()): Date[] {
  const start = getStartOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Obtient tous les jours d'un mois
 */
export function getDaysOfMonth(date: Date = new Date()): Date[] {
  const start = getStartOfMonth(date);
  const end = getEndOfMonth(date);
  const days: Date[] = [];
  
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
}

/**
 * Mois suivant
 */
export function getNextMonth(date: Date = new Date()): Date {
  return addMonths(date, 1);
}

/**
 * Mois précédent
 */
export function getPreviousMonth(date: Date = new Date()): Date {
  return subMonths(date, 1);
}

// ==================== COMPARAISONS ====================

/**
 * Vérifie si deux dates sont le même jour
 */
export function isSameDayCheck(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return isSameDay(d1, d2);
}

/**
 * Vérifie si une date est aujourd'hui
 */
export function isTodayCheck(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isToday(dateObj);
}

/**
 * Vérifie si une date est dans le passé
 */
export function isPastCheck(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isPast(dateObj);
}

/**
 * Vérifie si une date est dans le futur
 */
export function isFutureCheck(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isFuture(dateObj);
}

/**
 * Calcule la différence en jours entre deux dates
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return differenceInDays(d1, d2);
}

// ==================== UTILITAIRES ====================

/**
 * Convertit une date en string format ISO (YYYY-MM-DD)
 */
export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Convertit une string ISO en Date
 */
export function fromDateString(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Obtient l'heure actuelle au format HH:mm
 */
export function getCurrentTime(): string {
  return format(new Date(), 'HH:mm');
}

/**
 * Parse une string de temps (HH:mm) en heures et minutes
 */
export function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Combine une date et une heure en Date complète
 */
export function combineDateAndTime(date: Date, timeString: string): Date {
  const { hours, minutes } = parseTime(timeString);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

/**
 * Vérifie si une date est dans une plage
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

/**
 * Obtient le nom du mois
 */
export function getMonthName(date: Date = new Date()): string {
  return format(date, 'MMMM', { locale: fr });
}

/**
 * Obtient le nom du mois et l'année
 */
export function getMonthYearName(date: Date = new Date()): string {
  return format(date, 'MMMM yyyy', { locale: fr });
}
