import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { ModalProvider } from './src/context/ModalContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import AppNavigator from './src/navigation/AppNavigator';
import WebAlert from './src/components/WebAlert';
import { setWebAlertHandler } from './src/utils/alert';
import { adsenseManager } from './src/utils/adsense';

interface AlertOptions {
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

export default function App() {
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);

  useEffect(() => {
    setWebAlertHandler((options: AlertOptions) => {
      setAlertOptions(options);
    });
    
    // 初始化AdSense
    adsenseManager.initialize();
    
    // 隐藏初始内容，显示React应用
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const initialContent = document.getElementById('initial-content');
      if (initialContent) {
        initialContent.style.display = 'none';
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <BackgroundProvider>
          <ModalProvider>
            <AppNavigator />
            <StatusBar style="auto" />
            {alertOptions && (
              <WebAlert
                visible={!!alertOptions}
                title={alertOptions.title}
                message={alertOptions.message}
                buttons={alertOptions.buttons}
                onClose={() => setAlertOptions(null)}
              />
            )}
          </ModalProvider>
        </BackgroundProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}