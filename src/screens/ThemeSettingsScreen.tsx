import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface ThemeSettingsScreenProps {
  onBack: () => void;
}

const themeOptions = [
  {
    id: 'auto',
    name: '跟随系统',
    description: '根据系统设置自动切换',
    icon: '🔄',
  },
  {
    id: 'light',
    name: '浅色模式',
    description: '始终使用浅色主题',
    icon: '☀️',
  },
  {
    id: 'dark',
    name: '深色模式',
    description: '始终使用深色主题',
    icon: '🌙',
  },
];

const accentColors = [
  { id: 'blue', name: '蓝色', color: '#13a4ec' },
  { id: 'green', name: '绿色', color: '#10b981' },
  { id: 'purple', name: '紫色', color: '#8b5cf6' },
  { id: 'orange', name: '橙色', color: '#f59e0b' },
  { id: 'red', name: '红色', color: '#ef4444' },
  { id: 'pink', name: '粉色', color: '#ec4899' },
];

export default function ThemeSettingsScreen({ onBack }: ThemeSettingsScreenProps) {
  const { colors, isDarkMode, toggleDarkMode, primaryColor, setPrimaryColor } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(isDarkMode ? 'dark' : 'light');
  const [selectedAccentColor, setSelectedAccentColor] = useState(
    accentColors.find(c => c.color === primaryColor)?.id || 'blue'
  );

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    if (themeId === 'dark' && !isDarkMode) {
      toggleDarkMode();
    } else if (themeId === 'light' && isDarkMode) {
      toggleDarkMode();
    }
    Alert.alert('主题已更新', `已切换到${themeOptions.find(t => t.id === themeId)?.name}`);
  };

  const handleAccentColorChange = (colorId: string) => {
    setSelectedAccentColor(colorId);
    const colorOption = accentColors.find(c => c.id === colorId);
    if (colorOption) {
      setPrimaryColor(colorOption.color);
      Alert.alert('主题色已更新', `已切换到${colorOption.name}主题色`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>主题设置</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* 主题模式选择 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>主题模式</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            选择应用的外观主题
          </Text>
          
          <View style={[styles.optionsContainer, { backgroundColor: colors.surface }]}>
            {themeOptions.map((theme, index) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeOption,
                  index !== themeOptions.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                  selectedTheme === theme.id && { backgroundColor: colors.primary + '10' }
                ]}
                onPress={() => handleThemeChange(theme.id)}
              >
                <View style={styles.themeOptionLeft}>
                  <Text style={styles.themeIcon}>{theme.icon}</Text>
                  <View style={styles.themeInfo}>
                    <Text style={[styles.themeName, { color: colors.text }]}>{theme.name}</Text>
                    <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                      {theme.description}
                    </Text>
                  </View>
                </View>
                {selectedTheme === theme.id && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 主题色选择 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>主题色</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            选择应用的主题色彩
          </Text>
          
          <View style={styles.colorGrid}>
            {accentColors.map((colorOption) => (
              <TouchableOpacity
                key={colorOption.id}
                style={[
                  styles.colorOption,
                  { backgroundColor: colorOption.color },
                  selectedAccentColor === colorOption.id && styles.colorOptionSelected
                ]}
                onPress={() => handleAccentColorChange(colorOption.id)}
              >
                {selectedAccentColor === colorOption.id && (
                  <Text style={styles.colorCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.colorLabels}>
            {accentColors.map((colorOption) => (
              <Text
                key={`${colorOption.id}-label`}
                style={[
                  styles.colorLabel,
                  { color: selectedAccentColor === colorOption.id ? colors.primary : colors.textSecondary }
                ]}
              >
                {colorOption.name}
              </Text>
            ))}
          </View>
        </View>

        {/* 预览区域 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>预览</Text>
          <View style={[styles.previewContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.previewHeader}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>示例卡片</Text>
              <View style={[styles.previewBadge, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.previewBadgeText, { color: colors.primary }]}>学习</Text>
              </View>
            </View>
            <Text style={[styles.previewContent, { color: colors.textSecondary }]}>
              这是一个示例灵感卡片，展示当前主题的外观效果。
            </Text>
            <TouchableOpacity style={[styles.previewButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.previewButtonText}>示例按钮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 提示信息 */}
        <View style={[styles.tipContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tipTitle, { color: colors.text }]}>💡 提示</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            • 主题设置会立即生效并保存到本地{'\n'}
            • 跟随系统模式会根据设备的深色模式设置自动切换{'\n'}
            • 主题色会应用到按钮、链接和强调元素上
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  optionsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 14,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorOptionSelected: {
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  colorCheckmark: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  colorLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: '500',
    width: 48,
    textAlign: 'center',
  },
  previewContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  previewButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  previewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tipContainer: {
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});