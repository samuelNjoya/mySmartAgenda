import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés de stockage
const STORAGE_KEYS = {
  EVENTS: '@agenda_events',
  TASKS: '@agenda_tasks',
  HABITS: '@agenda_habits',
  NOTES: '@agenda_notes',
  SETTINGS: '@agenda_settings',
  STATISTICS: '@agenda_statistics'
};

// Initialiser le stockage
export const initDatabase = async () => {
  try {
    // Vérifier si les données existent, sinon initialiser
    const events = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!events) {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
    }
    
    const tasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    if (!tasks) {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]));
    }
    
    const habits = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    if (!habits) {
      await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify([]));
    }
    
    const notes = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    if (!notes) {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify([]));
    }
    
    console.log('✅ Base de données AsyncStorage initialisée');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    return false;
  }
};

// Fonctions CRUD pour les événements
export const eventService = {
  // Récupérer tous les événements
  getAll: async (): Promise<any[]> => {
    try {
      const eventsJson = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des événements:', error);
      return [];
    }
  },

  // Récupérer un événement par ID
  getById: async (id: string): Promise<any | null> => {
    try {
      const events = await eventService.getAll();
      return events.find(event => event.id === id) || null;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération de l'événement ${id}:`, error);
      return null;
    }
  },

  // Sauvegarder un événement
  save: async (event: any): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      const events = await eventService.getAll();
      const existingIndex = events.findIndex(e => e.id === event.id);
      
      if (existingIndex >= 0) {
        // Mise à jour
        events[existingIndex] = {
          ...event,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Création
        events.push({
          ...event,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      console.log('✅ Événement sauvegardé avec succès');
      return { success: true, data: event };
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de l\'événement:', error);
      return { success: false, error };
    }
  },

  // Supprimer un événement
  delete: async (id: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const events = await eventService.getAll();
      const filteredEvents = events.filter(event => event.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filteredEvents));
      console.log(`✅ Événement ${id} supprimé avec succès`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de l'événement ${id}:`, error);
      return { success: false, error };
    }
  },

  // Récupérer les événements par date
  getByDate: async (date: Date): Promise<any[]> => {
    try {
      const events = await eventService.getAll();
      const dateString = date.toISOString().split('T')[0];
      
      return events.filter(event => {
        const eventDate = new Date(event.startDate).toISOString().split('T')[0];
        return eventDate === dateString;
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des événements par date:', error);
      return [];
    }
  }
};

// Fonctions CRUD pour les tâches
export const taskService = {
  getAll: async (): Promise<any[]> => {
    try {
      const tasksJson = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des tâches:', error);
      return [];
    }
  },

  save: async (task: any): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      const tasks = await taskService.getAll();
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        tasks[existingIndex] = task;
      } else {
        tasks.push({
          ...task,
          createdAt: new Date().toISOString()
        });
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return { success: true, data: task };
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la tâche:', error);
      return { success: false, error };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const tasks = await taskService.getAll();
      const filteredTasks = tasks.filter(task => task.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filteredTasks));
      return { success: true };
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de la tâche ${id}:`, error);
      return { success: false, error };
    }
  },

  toggleComplete: async (id: string): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      const tasks = await taskService.getAll();
      const taskIndex = tasks.findIndex(task => task.id === id);
      
      if (taskIndex >= 0) {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          completed: !tasks[taskIndex].completed,
          completedAt: tasks[taskIndex].completed ? null : new Date().toISOString()
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        return { success: true, data: tasks[taskIndex] };
      }
      
      return { success: false, error: 'Tâche non trouvée' };
    } catch (error) {
      console.error(`❌ Erreur lors du basculement de la tâche ${id}:`, error);
      return { success: false, error };
    }
  }
};

// Fonctions pour les habitudes
export const habitService = {
  getAll: async (): Promise<any[]> => {
    try {
      const habitsJson = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
      return habitsJson ? JSON.parse(habitsJson) : [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des habitudes:', error);
      return [];
    }
  },

  save: async (habit: any): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      const habits = await habitService.getAll();
      const existingIndex = habits.findIndex(h => h.id === habit.id);
      
      if (existingIndex >= 0) {
        habits[existingIndex] = habit;
      } else {
        habits.push({
          ...habit,
          createdAt: new Date().toISOString(),
          streak: 0,
          bestStreak: 0,
          completedDates: []
        });
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
      return { success: true, data: habit };
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de l\'habitude:', error);
      return { success: false, error };
    }
  },

  markComplete: async (id: string, date: Date = new Date()): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      const habits = await habitService.getAll();
      const habitIndex = habits.findIndex(h => h.id === id);
      
      if (habitIndex >= 0) {
        const habit = habits[habitIndex];
        const dateString = date.toISOString().split('T')[0];
        
        if (!habit.completedDates.includes(dateString)) {
          habit.completedDates.push(dateString);
          habit.streak += 1;
          
          if (habit.streak > habit.bestStreak) {
            habit.bestStreak = habit.streak;
          }
          
          habits[habitIndex] = habit;
          await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        }
        
        return { success: true, data: habit };
      }
      
      return { success: false, error: 'Habitude non trouvée' };
    } catch (error) {
      console.error(`❌ Erreur lors de la complétion de l'habitude ${id}:`, error);
      return { success: false, error };
    }
  }
};

// Fonctions pour les notes
export const noteService = {
  getAll: async (): Promise<any[]> => {
    try {
      const notesJson = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notes:', error);
      return [];
    }
  },

  save: async (note: any): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      const notes = await noteService.getAll();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        notes[existingIndex] = {
          ...note,
          updatedAt: new Date().toISOString()
        };
      } else {
        notes.push({
          ...note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      return { success: true, data: note };
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la note:', error);
      return { success: false, error };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const notes = await noteService.getAll();
      const filteredNotes = notes.filter(note => note.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filteredNotes));
      return { success: true };
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de la note ${id}:`, error);
      return { success: false, error };
    }
  },

  togglePin: async (id: string): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      const notes = await noteService.getAll();
      const noteIndex = notes.findIndex(note => note.id === id);
      
      if (noteIndex >= 0) {
        notes[noteIndex] = {
          ...notes[noteIndex],
          isPinned: !notes[noteIndex].isPinned
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        return { success: true, data: notes[noteIndex] };
      }
      
      return { success: false, error: 'Note non trouvée' };
    } catch (error) {
      console.error(`❌ Erreur lors du basculement de l'épingle de la note ${id}:`, error);
      return { success: false, error };
    }
  }
};

// Sauvegarder les statistiques
export const saveStatistics = async (date: string, stats: any): Promise<boolean> => {
  try {
    const existingStats = await AsyncStorage.getItem(STORAGE_KEYS.STATISTICS);
    const allStats = existingStats ? JSON.parse(existingStats) : {};
    
    allStats[date] = stats;
    await AsyncStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(allStats));
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des statistiques:', error);
    return false;
  }
};

// Récupérer les statistiques
export const getStatistics = async (): Promise<any> => {
  try {
    const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.STATISTICS);
    return statsJson ? JSON.parse(statsJson) : {};
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
    return {};
  }
};

// Sauvegarder les paramètres
export const saveSettings = async (settings: any): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des paramètres:', error);
    return false;
  }
};

// Récupérer les paramètres
export const getSettings = async (): Promise<any> => {
  try {
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsJson ? JSON.parse(settingsJson) : {};
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des paramètres:', error);
    return {};
  }
};

// Backup complet
export const backupData = async (): Promise<string> => {
  try {
    const data = {
      events: await eventService.getAll(),
      tasks: await taskService.getAll(),
      habits: await habitService.getAll(),
      notes: await noteService.getAll(),
      statistics: await getStatistics(),
      settings: await getSettings()
    };
    
    return JSON.stringify(data);
  } catch (error) {
    console.error('❌ Erreur lors de la création du backup:', error);
    throw error;
  }
};

// Restauration
export const restoreData = async (backupJson: string): Promise<boolean> => {
  try {
    const data = JSON.parse(backupJson);
    
    await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data.events || []));
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks || []));
    await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits || []));
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes || []));
    await AsyncStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(data.statistics || {}));
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings || {}));
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
    return false;
  }
};

export default {
  initDatabase,
  eventService,
  taskService,
  habitService,
  noteService,
  saveStatistics,
  getStatistics,
  saveSettings,
  getSettings,
  backupData,
  restoreData
};