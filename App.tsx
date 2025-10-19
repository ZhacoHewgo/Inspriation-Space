import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { ModalProvider } from './src/context/ModalContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <BackgroundProvider>
          <ModalProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </ModalProvider>
        </BackgroundProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}