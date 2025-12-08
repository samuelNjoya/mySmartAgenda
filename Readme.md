npx create-expo-app AgendaRichissime --template blank-typescript
cd AgendaRichissime

# Navigation
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# UI & Icons
npx expo install react-native-vector-icons
npx expo install @expo/vector-icons
npx expo install react-native-paper
npx expo install @rneui/themed @rneui/base //erreur

# Animations & Gestures (react navigation depend de ces deux la)
npx expo install react-native-reanimated
npx expo install react-native-gesture-handler

# Calendrier
npx expo install react-native-calendars
npx expo install moment

# Notifications
npx expo install expo-notifications

# Stockage
npx expo install @react-native-async-storage/async-storage
npx expo install expo-sqlite

# Charts
npx expo install victory-native

# Autres utilitaires
npx expo install react-native-uuid
npx expo install expo-haptics
npx expo install expo-linear-gradient
npx expo install @react-native-community/datetimepicker
npx expo install react-dom react-native-web

# ces deux requis pour react-native-reanimated et victory-native
npx expo install react-native-worklets @shopify/react-native-skia