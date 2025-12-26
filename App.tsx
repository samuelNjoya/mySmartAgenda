import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { ThemeProvider } from './src/context/ThemeContext';
import MainNavigator from './src/navigation/MainNavigator';
import { initDatabase } from './src/database';
import Constants from 'expo-constants';
import { AppProvider } from './src/context/AppContext';

// Désactiver les notifications en développement Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Configuration des notifications seulement si pas sur Expo Go
if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export default function App() {
  useEffect(() => {
    // Initialiser la base de données
    const initializeApp = async () => {
      try {
        await initDatabase();
        console.log('✅ Application initialisée avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
      }
    };

    initializeApp();

    // Demander la permission pour les notifications seulement si pas sur Expo Go
    if (!isExpoGo) {
      (async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('⚠️ Permission pour les notifications refusée');
        }
      })();
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <ThemeProvider>
            <PaperProvider>
              <NavigationContainer>
                <MainNavigator />
                <StatusBar style="auto" />
              </NavigationContainer>
            </PaperProvider>
          </ThemeProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}