# 📱 Agenda App - Application d'Agenda Premium

Application d'agenda complète développée avec React Native, Expo et TypeScript.

## 🚀 Installation et Configuration

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Un simulateur iOS/Android ou l'app Expo Go sur votre téléphone

### Installation

```bash
# 1. Naviguer dans le dossier du projet
cd agenda-app

# 2. Installer les dépendances
npm install

# 3. Installer @react-native-community/datetimepicker (nécessaire)
npx expo install @react-native-community/datetimepicker

# 4. Installer les autres dépendances optionnelles si besoin
npx expo install expo-device expo-notifications

# 5. Démarrer l'application
npm start
```

### Lancement

```bash
# Mode développement
npm start

# Spécifique à une plateforme
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Navigateur web
```

## 📁 Structure du Projet

```
agenda-app/
├── App.tsx                      # Point d'entrée principal
├── app.json                     # Configuration Expo
├── package.json                 # Dépendances
├── tsconfig.json                # Configuration TypeScript
└── src/
    ├── components/              # Composants réutilisables
    │   └── common/              # Composants communs
    │       ├── Button.tsx       # Bouton personnalisé
    │       ├── Input.tsx        # Input avec validation
    │       ├── Card.tsx         # Carte d'affichage
    │       ├── Spinner.tsx      # Indicateur de chargement
    │       └── EmptyState.tsx   # État vide
    │
    ├── constants/               # Constantes de l'app
    │   ├── Colors.ts            # Palette de couleurs
    │   ├── Sizes.ts             # Tailles et espacements
    │   └── Quotes.ts            # Citations inspirantes
    │
    ├── contexts/                # Contextes React
    │   └── ThemeContext.tsx     # Gestion du thème
    │
    ├── navigation/              # Configuration de la navigation
    │   └── TabNavigator.tsx     # Navigation par onglets
    │
    ├── screens/                 # Écrans de l'application
    │   ├── auth/                # Authentification
    │   │   └── PinLockScreen.tsx
    │   ├── home/                # Écran Aujourd'hui
    │   │   └── HomeScreen.tsx
    │   ├── calendar/            # Calendrier
    │   │   ├── CalendarScreen.tsx
    │   │   └── EventFormScreen.tsx
    │   ├── tasks/               # Tâches
    │   │   └── TasksScreen.tsx (placeholder)
    │   ├── more/                # Plus
    │   │   └── MoreScreen.tsx (placeholder)
    │   └── settings/            # Paramètres
    │       └── SettingsScreen.tsx
    │
    ├── services/                # Services
    │   └── storage.ts           # AsyncStorage
    │
    ├── types/                   # Types TypeScript
    │   └── index.ts             # Tous les types
    │
    └── utils/                   # Utilitaires
        ├── validation.ts        # Validation des données
        └── dateHelpers.ts       # Helpers pour les dates
```

## ✨ Fonctionnalités Implémentées

### ✅ Fonctionnalités Complètes

1. **Sécurité**
   - ✅ Code PIN à 4 chiffres
   - ✅ Activation/Désactivation du PIN dans les paramètres
   - ✅ Modification du code PIN
   - ✅ Écran de verrouillage avec clavier numérique

2. **Thème**
   - ✅ Mode clair et sombre
   - ✅ Basculement automatique
   - ✅ Personnalisation complète des couleurs

3. **Écran Aujourd'hui**
   - ✅ Citation inspirante du jour (rotation automatique)
   - ✅ Événements du jour avec timeline
   - ✅ Tâches prioritaires
   - ✅ Habitudes à accomplir
   - ✅ Pull-to-refresh

4. **Calendrier**
   - ✅ Vue mensuelle
   - ✅ Marquage des dates avec événements
   - ✅ Sélection de date
   - ✅ Liste des événements par jour

5. **Événements**
   - ✅ Création d'événements
   - ✅ Modification d'événements
   - ✅ Titre, description, lieu
   - ✅ Date et heure de début/fin
   - ✅ Événements "toute la journée"
   - ✅ Choix de couleur
   - ✅ Choix d'emoji
   - ✅ Validation des données

6. **Composants Réutilisables**
   - ✅ Button (multiple variants)
   - ✅ Input (avec validation)
   - ✅ Card
   - ✅ Spinner (chargement)
   - ✅ EmptyState

7. **Stockage**
   - ✅ AsyncStorage pour persistence
   - ✅ CRUD complet
   - ✅ Soft delete (corbeille)
   - ✅ Export/Import de données

8. **Notifications Toast**
   - ✅ Feedback pour toutes les actions CRUD
   - ✅ Messages de succès
   - ✅ Messages d'erreur

## 🔨 À Compléter (Placeholders actuels)

### 📋 Tâches (TasksScreen)

**À implémenter :**
- Liste des tâches avec filtres
- Création/Édition de tâches
- Sous-tâches (checklist)
- Priorités (low, normal, high, urgent)
- Date d'échéance
- Listes personnalisées
- Drag & drop pour réorganiser
- Marquage comme terminée

**Fichiers à créer :**
```
src/screens/tasks/
├── TasksScreen.tsx (remplacer le placeholder)
├── TaskFormScreen.tsx
├── TaskDetailScreen.tsx
└── ListsManagementScreen.tsx
```

### 📊 Plus (MoreScreen)

**À implémenter :**

1. **Analytics**
   - Graphiques d'activité
   - Heatmap
   - Statistiques par catégorie
   - Export PDF

2. **Habitudes**
   - Création d'habitudes
   - Tracking quotidien/hebdomadaire
   - Streaks
   - Graphiques d'évolution

3. **Notes**
   - Éditeur de notes
   - Dossiers
   - Tags
   - Recherche

4. **Outils**
   - Timer Pomodoro
   - Routines
   - Templates

**Fichiers à créer :**
```
src/screens/more/
├── MoreScreen.tsx (remplacer le placeholder)
├── analytics/
│   ├── AnalyticsScreen.tsx
│   └── components/
├── habits/
│   ├── HabitsScreen.tsx
│   ├── HabitFormScreen.tsx
│   └── HabitDetailScreen.tsx
├── notes/
│   ├── NotesScreen.tsx
│   ├── NoteFormScreen.tsx
│   └── NoteDetailScreen.tsx
└── tools/
    ├── PomodoroScreen.tsx
    └── RoutinesScreen.tsx
```

### ⚙️ Paramètres (SettingsScreen)

**Déjà implémenté :**
- Thème clair/sombre
- Code PIN (activation, modification)

**À ajouter :**
- Profil utilisateur
- Préférences calendrier
- Notifications
- Sauvegarde/Restauration
- Export de données
- À propos

## 📚 Guide de Développement

### Créer un Nouvel Écran

1. **Créer le fichier de l'écran**

```typescript
// src/screens/example/ExampleScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Spinner, Card, EmptyState } from '../../components/common';

export function ExampleScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les données
    loadData();
  }, []);

  async function loadData() {
    // Votre logique
    setLoading(false);
  }

  if (loading) {
    return <Spinner fullScreen message="Chargement..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        {/* Votre contenu */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

2. **Ajouter la navigation**

```typescript
// Dans src/navigation/TabNavigator.tsx ou créer un Stack Navigator
<Tab.Screen
  name="Example"
  component={ExampleScreen}
  options={{
    title: 'Exemple',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="star" size={size} color={color} />
    ),
  }}
/>
```

### Utiliser AsyncStorage

```typescript
import { storage, STORAGE_KEYS, saveItemToList } from '../services/storage';

// Sauvegarder un élément
const item = {
  id: `item_${Date.now()}`,
  title: 'Mon élément',
  // ...
};
await saveItemToList(STORAGE_KEYS.EVENTS, item);

// Récupérer tous les éléments
const items = await storage.get(STORAGE_KEYS.EVENTS) || [];

// Supprimer un élément
await removeItemFromList(STORAGE_KEYS.EVENTS, itemId);
```

### Validation des Données

```typescript
import { validateEvent, hasErrors, formatErrors } from '../utils/validation';

const errors = validateEvent({
  title: 'Mon événement',
  startDate: new Date(),
  endDate: new Date(),
  allDay: false,
});

if (hasErrors(errors)) {
  Toast.show({
    type: 'error',
    text1: 'Erreur de validation',
    text2: formatErrors(errors),
  });
  return;
}

// Continuer avec la sauvegarde
```

### Utiliser le Thème

```typescript
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Mon texte</Text>
    </View>
  );
}
```

### Afficher un Toast

```typescript
import Toast from 'react-native-toast-message';

// Succès
Toast.show({
  type: 'success',
  text1: 'Succès',
  text2: 'L\'opération a réussi',
});

// Erreur
Toast.show({
  type: 'error',
  text1: 'Erreur',
  text2: 'Une erreur est survenue',
});

// Info
Toast.show({
  type: 'info',
  text1: 'Information',
  text2: 'Voici une information',
});
```

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez `src/constants/Colors.ts` :

```typescript
export const COLORS = {
  light: {
    primary: '#3B82F6',  // Changer la couleur primaire
    // ...
  },
  dark: {
    primary: '#60A5FA',
    // ...
  },
};
```

### Ajouter de Nouvelles Citations

Éditez `src/constants/Quotes.ts` :

```typescript
export const INSPIRATIONAL_QUOTES: Quote[] = [
  {
    text: "Votre nouvelle citation",
    author: "Auteur"
  },
  // ...
];
```

### Créer un Nouveau Composant Réutilisable

```typescript
// src/components/common/MyComponent.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface MyComponentProps {
  // Props
}

export function MyComponent({ }: MyComponentProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Contenu */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Styles
  },
});
```

N'oubliez pas de l'exporter dans `src/components/common/index.ts` :

```typescript
export { MyComponent } from './MyComponent';
```

## 🐛 Débogage

### Logs

Utilisez `console.log`, `console.error`, `console.warn` pour déboguer.

### React Native Debugger

1. Installer React Native Debugger
2. Ouvrir le debugger
3. Dans l'app : secouer le téléphone/simulateur → "Debug"

### Effacer le Cache

```bash
npx expo start -c
```

## 📦 Build Production

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

## 🔐 Sécurité

**⚠️ IMPORTANT - Code PIN :**

Dans la version actuelle, le code PIN est stocké en clair dans AsyncStorage. 
**Pour une version production, vous DEVEZ :**

1. Utiliser `expo-secure-store` au lieu de AsyncStorage pour le PIN
2. Hasher le PIN avec bcrypt ou similaire
3. Ajouter une validation par email/SMS pour la récupération du PIN

Exemple de sécurisation :

```typescript
import * as SecureStore from 'expo-secure-store';
import bcrypt from 'react-native-bcrypt';

// Sauvegarder le PIN hashé
const hashedPin = bcrypt.hashSync(pin, 10);
await SecureStore.setItemAsync('pin_code', hashedPin);

// Vérifier le PIN
const savedPin = await SecureStore.getItemAsync('pin_code');
const isValid = bcrypt.compareSync(enteredPin, savedPin);
```

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à créer une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, créez une issue sur le dépôt GitHub.

---

**Bon développement ! 🚀**
