import { Platform } from 'react-native';

// Web存储工具
export const WebStorage = {
  // 保存数据到localStorage
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
  },

  // 从localStorage获取数据
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
        return null;
      }
    }
    return null;
  },

  // 删除localStorage中的数据
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
      }
    }
  },

  // 清空所有数据
  clear: async (): Promise<void> => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
  },
};

// 通用存储接口，自动选择合适的存储方式
export const Storage = {
  setItem: WebStorage.setItem,
  getItem: WebStorage.getItem,
  removeItem: WebStorage.removeItem,
  clear: WebStorage.clear,
};

// 存储键名常量
export const STORAGE_KEYS = {
  INSPIRATIONS: 'inspirations',
  CATEGORY_BACKGROUNDS: 'categoryBackgrounds',
  THEME_SETTINGS: 'themeSettings',
  USER_PREFERENCES: 'userPreferences',
};