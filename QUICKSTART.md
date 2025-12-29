# 🚀 Guide de Démarrage Rapide - Agenda App

## ⚡ Installation en 5 Minutes

### 1. Prérequis
```bash
# Vérifier Node.js (doit être v16+)
node --version

# Installer Expo CLI si ce n'est pas déjà fait
npm install -g expo-cli
```

### 2. Installation du Projet
```bash
cd agenda-app
npm install
```

### 3. Installer les Dépendances Manquantes
```bash
npx expo install @react-native-community/datetimepicker
npx expo install expo-haptics
npx expo install react-native-toast-message
```

### 4. Lancer l'Application
```bash
npm start
```

Puis scanner le QR code avec Expo Go (iOS/Android) ou appuyer sur :
- `i` pour iOS Simulator
- `a` pour Android Emulator
- `w` pour Web

## 🎯 Première Utilisation

### Sans Code PIN (par défaut)
L'app démarre directement sur l'écran "Aujourd'hui".

### Avec Code PIN
1. Aller dans "Paramètres" (dernier onglet)
2. Activer "Code PIN"
3. Entrer un code à 4 chiffres
4. Confirmer le code
5. La prochaine fois que vous lancerez l'app, le code sera demandé

## 📱 Navigation

L'app a 5 onglets principaux :

1. **🏠 Aujourd'hui** - Dashboard du jour
   - Citation inspirante
   - Événements du jour
   - Tâches prioritaires
   - Habitudes

2. **📅 Calendrier** - Gestion des événements
   - Vue mensuelle
   - Créer/Modifier des événements
   - Voir les événements par jour

3. **✅ Tâches** - Gestion des tâches
   - (Placeholder - à compléter)

4. **📊 Plus** - Fonctionnalités avancées
   - (Placeholder - à compléter)

5. **⚙️ Paramètres** - Configuration
   - Thème clair/sombre
   - Code PIN
   - Autres paramètres

## ✨ Fonctionnalités Implémentées

### ✅ Événements
- ➕ Créer un événement : Calendrier → Bouton +
- ✏️ Modifier un événement : Cliquer sur l'événement
- 🗑️ Supprimer un événement : (à implémenter dans le formulaire)

### ✅ Code PIN
- Activer dans Paramètres → Code PIN
- Modifier le code existant
- Désactiver

### ✅ Thème
- Basculer dans Paramètres → Thème sombre

## 🛠️ Développement

### Structure des Données
Tout est sauvegardé dans AsyncStorage :
- Événements : `@agenda_events`
- Tâches : `@agenda_tasks`
- Habitudes : `@agenda_habits`
- Paramètres : `@agenda_settings`

### Effacer les Données
Pour repartir de zéro pendant le développement :

```javascript
// Dans n'importe quel composant
import { storage } from './src/services/storage';
await storage.clear();
```

### Voir les Données Stockées
```javascript
const events = await storage.get('@agenda_events');
console.log('Événements:', events);
```

## 🐛 Problèmes Courants

### "Cannot find module '@react-native-community/datetimepicker'"
```bash
npx expo install @react-native-community/datetimepicker
```

### "Cannot find module 'react-native-toast-message'"
```bash
npm install react-native-toast-message
```

### L'app ne charge pas
```bash
# Effacer le cache
npx expo start -c
```

### Erreur de navigation
```bash
# Réinstaller les dépendances de navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

## 📝 Prochaines Étapes

1. **Compléter l'écran Tâches**
   - Voir `src/screens/tasks/TasksScreen.tsx`
   - Créer `TaskFormScreen.tsx`

2. **Compléter l'écran Plus**
   - Analytics
   - Habitudes
   - Notes
   - Outils (Pomodoro, Routines)

3. **Améliorer les Événements**
   - Ajouter la suppression
   - Ajouter les rappels
   - Ajouter la répétition

4. **Notifications**
   - Implémenter les rappels
   - Push notifications

5. **Sécurité**
   - Hasher le code PIN
   - Utiliser expo-secure-store

## 📚 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## 💡 Astuces

### Recharger l'App
- iOS/Android : Secouer le device → "Reload"
- Simulateur iOS : Cmd+R
- Emulator Android : RR (double R)

### Déboguer
- Secouer le device → "Debug"
- Ou : Cmd+D (iOS) / Cmd+M (Android)

### Format du Code
```bash
# Installer Prettier (optionnel)
npm install --save-dev prettier
npx prettier --write "src/**/*.{ts,tsx}"
```

---

**🎉 Vous êtes prêt ! Bon développement !**

Pour toute question, consultez le README.md complet.
