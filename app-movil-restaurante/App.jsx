// App.jsx
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './src/navigation/AppNavigator.jsx';
import { useAuthStore } from './src/shared/store/authStore.js';

enableScreens();

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => { hydrate(); }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="light" backgroundColor="#0a0c0f" />
    </SafeAreaProvider>
  );
}