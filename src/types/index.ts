export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  color: string;
  category: EventCategory;
  repeat: RepeatPattern;
  notification?: Date;
  participants?: string[];
  notes?: string;
  completed: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  subtasks?: SubTask[];
  tags: string[];
  createdAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[];
  streak: number;
  bestStreak: number;
  completedDates: Date[];
  reminder?: Date;
  category: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  attachments?: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventCategory = 
  | 'work' 
  | 'personal' 
  | 'health' 
  | 'education' 
  | 'social' 
  | 'family' 
  | 'other';

export type RepeatPattern = 
  | 'none' 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly' 
  | 'custom';

export interface Statistics {
  eventsCompleted: number;
  tasksCompleted: number;
  habitsCompleted: number;
  productivityScore: number;
  busiestDay: string;
  mostProductiveTime: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
}