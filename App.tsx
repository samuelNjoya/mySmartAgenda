/**
 * App.tsx - Point d'entrée principal de l'application
 * Assemble la navigation, les contextes et la configuration
 */

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Contextes
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

// Navigation
import { TabNavigator } from './src/navigation/TabNavigator';

// Écrans
import { PinLockScreen } from './src/screens/auth/PinLockScreen';
import { EventFormScreen } from './src/screens/calendar/EventFormScreen';
import { EventDetailScreen } from './src/screens/calendar/EventDetailScreen';
import { TaskFormScreen } from './src/screens/tasks/TaskFormScreen';
import { TaskDetailScreen } from './src/screens/tasks/TaskDetailScreen';

// Services
import { storage, STORAGE_KEYS } from './src/services/storage';

const Stack = createStackNavigator();

// ==================== COMPOSANT PRINCIPAL AVEC CONTEXTE ====================

function AppContent() {
  const { colors, theme } = useTheme();
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ==================== EFFETS ====================

  useEffect(() => {
    checkPinStatus();
  }, []);

  // ==================== FONCTIONS ====================

  /**
   * Vérifie si le PIN est activé
   */
  async function checkPinStatus() {
    try {
      const settings = await storage.get(STORAGE_KEYS.SETTINGS);
      const pinEnabled = settings?.security?.pinEnabled || false;
      setIsLocked(pinEnabled);
    } catch (error) {
      console.error('Erreur lors de la vérification du PIN:', error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Déverrouille l'application
   */
  function handleUnlock() {
    setIsLocked(false);
  }

  // ==================== RENDER ====================

  if (isLoading) {
    return null; // Ou un écran de chargement
  }

  // Si l'app est verrouillée, afficher l'écran PIN
  if (isLocked) {
    return (
      <>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <PinLockScreen onUnlock={handleUnlock} />
      </>
    );
  }

  // Application déverrouillée
  return (
    <NavigationContainer>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
        }}
      >
        {/* Tabs principaux */}
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        {/* Formulaire d'événement */}
        <Stack.Screen
          name="EventForm"
          component={EventFormScreen}
          options={({ route }) => ({
            title: (route.params as any)?.eventId
              ? 'Modifier l\'événement'
              : 'Nouvel événement',
            presentation: 'modal',
          })}
        />

        {/* Détails d'événement */}
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{ title: 'Détails de l\'événement' }}
        />

        {/* Formulaire de tâche */}
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={({ route }) => ({
            title: (route.params as any)?.taskId
              ? 'Modifier la tâche'
              : 'Nouvelle tâche',
            presentation: 'modal',
          })}
        />

        {/* Détails de tâche */}
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: 'Détails de la tâche' }}
        />
      </Stack.Navigator>

      {/* Toast notifications */}
      <Toast />
    </NavigationContainer>
  );
}

// ==================== APP AVEC PROVIDERS ====================

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
