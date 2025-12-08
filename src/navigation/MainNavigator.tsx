import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import TasksScreen from '../screens/TasksScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Accueil':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Calendrier':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Tâches':
              iconName = focused ? 'checkbox-marked' : 'checkbox-marked-outline';
              break;
            case 'Projets':
              iconName = focused ? 'folder' : 'folder-outline';
              break;
            case 'Paramètres':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Accueil" 
        component={HomeScreen}
        options={{ title: 'Tableau de bord' }}
      />
      <Tab.Screen 
        name="Calendrier" 
        component={CalendarScreen}
        options={{ title: 'Calendrier' }}
      />
      <Tab.Screen 
        name="Tâches" 
        component={TasksScreen}
        options={{ title: 'Tâches & Habitudes' }}
      />
      <Tab.Screen 
        name="Projets" 
        component={ProjectsScreen}
        options={{ title: 'Projets & Notes' }}
      />
      <Tab.Screen 
        name="Paramètres" 
        component={SettingsScreen}
        options={{ title: 'Paramètres & Stats' }}
      />
    </Tab.Navigator>
  );
}