import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eventService, taskService, habitService, noteService } from '../database';
import { getQuoteOfTheDay } from '../services/quotesService';

interface Event {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  category: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface Habit {
  id: string;
  title: string;
  streak: number;
  completed: boolean;
}

interface AppContextType {
  // Données
  events: Event[];
  tasks: Task[];
  habits: Habit[];
  notes: any[];
  
  // Statistiques
  stats: {
    todayEvents: number;
    pendingTasks: number;
    currentStreak: number;
    productivity: number;
  };
  
  // Citations
  dailyQuote: string;
  
  // Fonctions de chargement
  loadEvents: () => Promise<void>;
  loadTasks: () => Promise<void>;
  loadHabits: () => Promise<void>;
  loadNotes: () => Promise<void>;
  
  // Fonctions de mise à jour
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  
  // Fonctions de calcul
  calculateStats: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [dailyQuote, setDailyQuote] = useState('');
  const [stats, setStats] = useState({
    todayEvents: 0,
    pendingTasks: 0,
    currentStreak: 0,
    productivity: 0,
  });

  // Initialiser la citation du jour
  useEffect(() => {
    setDailyQuote(getQuoteOfTheDay());
  }, []);

  // Charger toutes les données
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadEvents(),
      loadTasks(),
      loadHabits(),
      loadNotes(),
    ]);
  };

  const loadEvents = async () => {
    try {
      const loadedEvents = await eventService.getAll();
      const formattedEvents = loadedEvents.map(event => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
      setEvents(formattedEvents);
      calculateStats();
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const loadedTasks = await taskService.getAll();
      const formattedTasks = loadedTasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(formattedTasks);
      calculateStats();
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    }
  };

  const loadHabits = async () => {
    try {
      const loadedHabits = await habitService.getAll();
      setHabits(loadedHabits);
      calculateStats();
    } catch (error) {
      console.error('Erreur lors du chargement des habitudes:', error);
    }
  };

  const loadNotes = async () => {
    try {
      const loadedNotes = await noteService.getAll();
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    }
  };

  const calculateStats = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Événements du jour
    const todayEvents = events.filter(event => {
      const eventDate = event.startDate.toISOString().split('T')[0];
      return eventDate === todayString && !event.completed;
    }).length;
    
    // Tâches en attente
    const pendingTasks = tasks.filter(task => !task.completed).length;
    
    // Streak actuel (max parmi les habitudes)
    const currentStreak = habits.length > 0 
      ? Math.max(...habits.map(h => h.streak))
      : 0;
    
    // Productivité (tâches complétées / total)
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const productivity = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;
    
    setStats({
      todayEvents,
      pendingTasks,
      currentStreak,
      productivity,
    });
  };

  // Fonctions pour les événements
  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      const newEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      await eventService.save(newEvent);
      await loadEvents();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      await eventService.save({ id, ...updates } as any);
      await loadEvents();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventService.delete(id);
      await loadEvents();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  };

  // Fonctions pour les tâches
  const addTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
      };
      await taskService.save(newTask);
      await loadTasks();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
      throw error;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      await taskService.toggleComplete(id);
      await loadTasks();
    } catch (error) {
      console.error('Erreur lors du basculement de la tâche:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.delete(id);
      await loadTasks();
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw error;
    }
  };

  // Fonctions pour les habitudes
  const addHabit = async (habitData: Omit<Habit, 'id'>) => {
    try {
      const newHabit = {
        ...habitData,
        id: Date.now().toString(),
      };
      await habitService.save(newHabit);
      await loadHabits();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'habitude:', error);
      throw error;
    }
  };

  const toggleHabit = async (id: string) => {
    try {
      await habitService.markComplete(id);
      await loadHabits();
    } catch (error) {
      console.error('Erreur lors du basculement de l\'habitude:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        events,
        tasks,
        habits,
        notes,
        stats,
        dailyQuote,
        loadEvents,
        loadTasks,
        loadHabits,
        loadNotes,
        addEvent,
        updateEvent,
        deleteEvent,
        addTask,
        toggleTask,
        deleteTask,
        addHabit,
        toggleHabit,
        calculateStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé à l\'intérieur de AppProvider');
  }
  return context;
};