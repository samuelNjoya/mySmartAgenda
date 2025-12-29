/**
 * Types TypeScript pour l'application Agenda
 * Contient toutes les interfaces et types utilisés dans l'app
 */

// ==================== ÉVÉNEMENTS ====================

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location?: string;
  color: string;
  category: string;
  emoji?: string;
  recurrence?: RecurrencePattern;
  reminders: Reminder[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Pour soft delete
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number; // Ex: tous les 2 jours
  daysOfWeek?: number[]; // [0,1,2,3,4,5,6] = Dim-Sam
  dayOfMonth?: number; // 1-31
  endDate?: Date;
  count?: number; // Nombre d'occurrences
}

export interface Reminder {
  id: string;
  type: 'time';
  minutes: number; // Minutes avant l'événement
}

// ==================== TÂCHES ====================

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: Date;
  dueTime?: string; // Format "HH:mm"
  listId: string;
  category?: string;
  tags: string[];
  subtasks: Subtask[];
  recurrence?: RecurrencePattern;
  reminders: Reminder[];
  estimatedTime?: number; // minutes
  order: number; // Pour tri manuel
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  deletedAt?: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon?: string;
  order: number;
  archived: boolean;
}

// ==================== HABITUDES ====================

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[]; // Pour fréquence hebdomadaire
  targetCount?: number; // Si "X fois par semaine"
  reminders: Reminder[];
  startDate: Date;
  endDate?: Date;
  archived: boolean;
  createdAt: Date;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // Format YYYY-MM-DD
  completed: boolean;
  notes?: string;
}

// ==================== NOTES ====================

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  favorite: boolean;
  linkedEventId?: string;
  linkedTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  order: number;
}

// ==================== CATÉGORIES ====================

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type: 'event' | 'task' | 'habit' | 'all';
  order: number;
}

// ==================== ROUTINES ====================

export interface Routine {
  id: string;
  name: string;
  type: 'morning' | 'evening' | 'custom';
  steps: RoutineStep[];
  autoStart: boolean;
  startTime?: string; // Format "HH:mm"
  daysOfWeek?: number[];
  enabled: boolean;
}

export interface RoutineStep {
  id: string;
  title: string;
  duration?: number; // minutes
  completed: boolean;
  order: number;
}

// ==================== TEMPLATES ====================

export interface Template {
  id: string;
  name: string;
  type: 'event' | 'task' | 'note';
  data: Partial<Event | Task | Note>;
  icon?: string;
  color?: string;
}

// ==================== PARAMÈTRES ====================

export interface Settings {
  userId: string;
  profile: {
    name: string;
    email?: string;
    avatar?: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  calendar: {
    firstDayOfWeek: number; // 0 = dimanche, 1 = lundi
    defaultView: 'month' | 'week' | 'day' | 'list';
    timeFormat: '12h' | '24h';
    dateFormat: string;
  };
  notifications: {
    enabled: boolean;
    events: boolean;
    tasks: boolean;
    habits: boolean;
    sound: boolean;
    vibrate: boolean;
  };
  security: {
    pinEnabled: boolean;
    pinCode?: string; // Hashé
    autoLockMinutes: number;
  };
  backup: {
    autoBackup: boolean;
    frequency: 'daily' | 'weekly';
    lastBackup?: Date;
  };
}

// ==================== ANALYTICS ====================

export interface DailyAnalytics {
  date: string; // Format YYYY-MM-DD
  eventsCount: number;
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  focusTime: number; // minutes
  categoryBreakdown: {
    [categoryId: string]: number; // minutes
  };
}

// ==================== CITATION INSPIRANTE ====================

export interface DailyQuote {
  id: string;
  text: string;
  author: string;
  date: string; // Format YYYY-MM-DD
}

// ==================== NAVIGATION ====================

export type RootStackParamList = {
  PinLock: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Home: undefined;
  Calendar: undefined;
  Tasks: undefined;
  More: undefined;
  Settings: undefined;
};

export type CalendarStackParamList = {
  CalendarMain: undefined;
  EventForm: { eventId?: string; date?: Date };
  EventDetail: { eventId: string };
};

export type TasksStackParamList = {
  TasksMain: undefined;
  TaskForm: { taskId?: string; listId?: string };
  TaskDetail: { taskId: string };
  ListsManagement: undefined;
};

export type MoreStackParamList = {
  MoreMain: undefined;
  Analytics: undefined;
  Habits: undefined;
  HabitForm: { habitId?: string };
  HabitDetail: { habitId: string };
  Notes: undefined;
  NoteForm: { noteId?: string };
  NoteDetail: { noteId: string };
  Pomodoro: undefined;
  Routines: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  Appearance: undefined;
  CalendarSettings: undefined;
  NotificationSettings: undefined;
  SecuritySettings: undefined;
  BackupSettings: undefined;
  About: undefined;
};

// ==================== UTILITAIRES ====================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ToastConfig {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
