/**
 * Context pour gérer le thème de l'application
 * Permet de basculer entre mode clair et sombre
 */

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import { COLORS } from '../constants/Colors';
import { storage, STORAGE_KEYS } from '../services/storage';

// ==================== TYPES ====================

type Theme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  colors: typeof COLORS.light;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

// ==================== CONTEXT ====================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [theme, setTheme] = useState<Theme>('light');

  // ==================== EFFETS ====================

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Écouter les changements de thème système si mode auto
  useEffect(() => {
    if (themeMode === 'auto') {
      const systemTheme = Appearance.getColorScheme() || 'light';
      setTheme(systemTheme);

      // Écouter les changements
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if (themeMode === 'auto') {
          setTheme(colorScheme || 'light');
        }
      });

      return () => subscription.remove();
    } else {
      // Mode manuel
      setTheme(themeMode);
    }
  }, [themeMode]);

  // ==================== FONCTIONS ====================

  /**
   * Charge le thème sauvegardé
   */
  async function loadSavedTheme() {
    try {
      const settings = await storage.get(STORAGE_KEYS.SETTINGS);
      if (settings?.appearance?.theme) {
        setThemeModeState(settings.appearance.theme);
      } else {
        // Par défaut, utiliser le thème système
        const systemTheme = Appearance.getColorScheme() || 'light';
        setThemeModeState('auto');
        setTheme(systemTheme);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
    }
  }

  /**
   * Change le mode du thème et le sauvegarde
   */
  async function setThemeMode(mode: ThemeMode) {
    setThemeModeState(mode);
    
    try {
      const settings = (await storage.get(STORAGE_KEYS.SETTINGS)) || {};
      const updatedSettings = {
        ...settings,
        appearance: {
          ...settings.appearance,
          theme: mode,
        },
      };
      await storage.save(STORAGE_KEYS.SETTINGS, updatedSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  }

  /**
   * Bascule entre clair et sombre
   */
  function toggleTheme() {
    const newMode = theme === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  }

  // ==================== VALEUR DU CONTEXT ====================

  const colors = COLORS[theme];

  const value: ThemeContextType = {
    theme,
    themeMode,
    colors,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ==================== HOOK ====================

/**
 * Hook pour utiliser le thème
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  
  return context;
}
