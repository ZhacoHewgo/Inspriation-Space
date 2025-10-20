import { Alert, Platform } from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
  title: string;
  message: string;
  buttons?: AlertButton[];
}

// Web端的Alert状态管理
let webAlertCallback: ((options: AlertOptions) => void) | null = null;

export const setWebAlertHandler = (handler: (options: AlertOptions) => void) => {
  webAlertCallback = handler;
};

export const showAlert = (title: string, message: string, buttons?: AlertButton[]) => {
  if (Platform.OS === 'web') {
    if (webAlertCallback) {
      webAlertCallback({ title, message, buttons });
    } else {
      // 降级到浏览器原生alert
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    // 移动端使用React Native的Alert
    Alert.alert(title, message, buttons);
  }
};