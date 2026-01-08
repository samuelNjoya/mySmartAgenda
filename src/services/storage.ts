/**
 * Service de stockage utilisant AsyncStorage
 * Gère la persistence de toutes les données de l'application
 * CORRIGÉ : Gère correctement la sérialisation des Dates
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ==================== CLÉS DE STOCKAGE ====================

export const STORAGE_KEYS = {
  EVENTS: '@agenda_events',
  TASKS: '@agenda_tasks',
  TASK_LISTS: '@agenda_task_lists',
  HABITS: '@agenda_habits',
  HABIT_LOGS: '@agenda_habit_logs',
  NOTES: '@agenda_notes',
  FOLDERS: '@agenda_folders',
  CATEGORIES: '@agenda_categories',
  ROUTINES: '@agenda_routines',
  TEMPLATES: '@agenda_templates',
  SETTINGS: '@agenda_settings',
  ANALYTICS: '@agenda_analytics',
  DELETED: '@agenda_deleted',
  LAST_QUOTE_DATE: '@agenda_last_quote_date',
} as const;

// ==================== HELPERS DATE ====================

/**
 * Détecte si une string est une date ISO
 */
function isISODateString(value: any): boolean {
  if (typeof value !== 'string') return false;
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return isoDatePattern.test(value);
}

/**
 * Convertit récursivement les strings ISO en objets Date
 */
function reviveDates(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Si c'est une string qui ressemble à une date ISO, la convertir
  if (isISODateString(obj)) {
    return new Date(obj);
  }

  // Si c'est un array, parcourir récursivement
  if (Array.isArray(obj)) {
    return obj.map(item => reviveDates(item));
  }

  // Si c'est un objet, parcourir toutes les propriétés
  if (typeof obj === 'object') {
    const revivedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      revivedObj[key] = reviveDates(value);
    }
    return revivedObj;
  }

  // Sinon, retourner tel quel
  return obj;
}

// ==================== SERVICE GÉNÉRIQUE ====================

class StorageService {
  /**
   * Sauvegarde des données dans AsyncStorage
   * @param key - Clé de stockage
   * @param value - Valeur à stocker (sera sérialisée en JSON)
   */
  async save<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`✅ Sauvegardé: ${key}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la sauvegarde (${key}):`, error);
      throw new Error(`Impossible de sauvegarder les données: ${key}`);
    }
  }

  /**
   * Récupère des données depuis AsyncStorage
   * CORRIGÉ : Convertit automatiquement les strings ISO en Date
   * @param key - Clé de stockage
   * @returns La valeur désérialisée ou null si non trouvée
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue == null) {
        return null;
      }

      // Parse le JSON
      const parsed = JSON.parse(jsonValue);
      
      // Convertit les strings ISO en Date récursivement
      const revived = reviveDates(parsed);
      
      console.log(`✅ Chargé: ${key}`);
      return revived as T;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération (${key}):`, error);
      return null;
    }
  }

  /**
   * Supprime des données d'AsyncStorage
   * @param key - Clé de stockage
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur lors de la suppression (${key}):`, error);
      throw new Error(`Impossible de supprimer les données: ${key}`);
    }
  }

  /**
   * Vide complètement AsyncStorage (ATTENTION!)
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erreur lors du nettoyage complet:', error);
      throw new Error('Impossible de vider le stockage');
    }
  }

  /**
   * Obtient toutes les clés stockées
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Erreur lors de la récupération des clés:', error);
      return [];
    }
  }

  /**
   * Obtient la taille totale des données stockées (en bytes)
   */
  async getStorageSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Erreur lors du calcul de la taille:', error);
      return 0;
    }
  }
}

// ==================== INSTANCE UNIQUE ====================

export const storage = new StorageService();

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Sauvegarde un élément dans une liste
 * @param key - Clé de la liste
 * @param item - Élément à ajouter
 * @param getId - Fonction pour obtenir l'ID de l'élément
 */
export async function saveItemToList<T extends { id: string }>(
  key: string,
  item: T
): Promise<void> {
  const list = (await storage.get<T[]>(key)) || [];
  const index = list.findIndex((i) => i.id === item.id);
  
  if (index >= 0) {
    // Mise à jour
    list[index] = item;
    console.log(`✅ Mise à jour item: ${item.id} dans ${key}`);
  } else {
    // Ajout
    list.push(item);
    console.log(`✅ Ajout item: ${item.id} dans ${key}`);
  }
  
  await storage.save(key, list);
  console.log(`✅ Liste ${key} sauvegardée: ${list.length} items`);
}

/**
 * Supprime un élément d'une liste
 * @param key - Clé de la liste
 * @param itemId - ID de l'élément à supprimer
 */
export async function removeItemFromList(
  key: string,
  itemId: string
): Promise<void> {
  const list = (await storage.get<any[]>(key)) || [];
  const filteredList = list.filter((item) => item.id !== itemId);
  await storage.save(key, filteredList);
}

/**
 * Obtient un élément spécifique d'une liste
 * @param key - Clé de la liste
 * @param itemId - ID de l'élément à récupérer
 */
export async function getItemFromList<T extends { id: string }>(
  key: string,
  itemId: string
): Promise<T | null> {
  const list = (await storage.get<T[]>(key)) || [];
  return list.find((item) => item.id === itemId) || null;
}

/**
 * Soft delete - Déplace un élément dans la corbeille OU le marque comme supprimé/archivé
 * @param sourceKey - Clé source
 * @param itemId - ID de l'élément
 * @param deleteField - Champ à utiliser pour marquer la suppression (default: 'deletedAt')
 * @param deleteValue - Valeur à mettre dans le champ (default: Date ISO string)
 */
export async function softDelete(
  sourceKey: string,
  itemId: string,
  deleteField: string = 'deletedAt',
  deleteValue: any = new Date().toISOString()
): Promise<void> {
  const list = (await storage.get<any[]>(sourceKey)) || [];
  const item = list.find((i) => i.id === itemId);
  
  if (item) {
    // Marque comme supprimé/archivé
    item[deleteField] = deleteValue;
    
    // Si c'est un soft delete classique (deletedAt), mettre dans la corbeille
    if (deleteField === 'deletedAt') {
      // Sauvegarde dans la corbeille
      const deleted = (await storage.get<any[]>(STORAGE_KEYS.DELETED)) || [];
      deleted.push({ ...item, sourceKey });
      await storage.save(STORAGE_KEYS.DELETED, deleted);
      
      // Supprime de la source
      await removeItemFromList(sourceKey, itemId);
    } else {
      // Sinon (comme 'archived'), juste mettre à jour l'item
      await storage.save(sourceKey, list);
    }
    
    console.log(`✅ Soft delete: ${itemId} (${deleteField}=${deleteValue})`);
  }
}

/**
 * Restaure un élément de la corbeille
 * @param itemId - ID de l'élément à restaurer
 */
export async function restoreFromTrash(itemId: string): Promise<void> {
  const deleted = (await storage.get<any[]>(STORAGE_KEYS.DELETED)) || [];
  const item = deleted.find((i) => i.id === itemId);
  
  if (item) {
    const { sourceKey, deletedAt, ...cleanItem } = item;
    
    // Restaure dans la source
    await saveItemToList(sourceKey, cleanItem);
    
    // Retire de la corbeille
    const newDeleted = deleted.filter((i) => i.id !== itemId);
    await storage.save(STORAGE_KEYS.DELETED, newDeleted);
  }
}

/**
 * Nettoie la corbeille (éléments de plus de X jours)
 * @param days - Nombre de jours avant suppression définitive
 */
export async function cleanTrash(days: number = 30): Promise<void> {
  const deleted = (await storage.get<any[]>(STORAGE_KEYS.DELETED)) || [];
  const now = new Date();
  const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const filtered = deleted.filter((item) => {
    const deletedDate = new Date(item.deletedAt);
    return deletedDate > threshold;
  });
  
  await storage.save(STORAGE_KEYS.DELETED, filtered);
}

/**
 * Exporte toutes les données en JSON
 */
export async function exportAllData(): Promise<string> {
  try {
    const keys = await storage.getAllKeys();
    const data: Record<string, any> = {};
    
    for (const key of keys) {
      data[key] = await storage.get(key);
    }
    
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    throw new Error('Impossible d\'exporter les données');
  }
}

/**
 * Importe des données depuis JSON
 * @param jsonData - Données au format JSON
 */
export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    
    for (const [key, value] of Object.entries(data)) {
      await storage.save(key, value);
    }
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    throw new Error('Impossible d\'importer les données');
  }
}