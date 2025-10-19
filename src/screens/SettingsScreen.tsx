import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import BackgroundCustomScreen from './BackgroundCustomScreen';
import ThemeSettingsScreen from './ThemeSettingsScreen';
import TagManagementScreen from './TagManagementScreen';

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  type: 'navigation' | 'toggle';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingsScreenProps {
  onBack?: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<'settings' | 'background' | 'theme' | 'tags'>('settings');

  const generalSettings: SettingItem[] = [
    {
      id: 'theme',
      title: '主题设置',
      icon: '🎨',
      type: 'navigation',
      onPress: () => setCurrentScreen('theme'),
    },
    {
      id: 'darkMode',
      title: '夜间模式',
      icon: '🌙',
      type: 'toggle',
      value: isDarkMode,
      onToggle: toggleDarkMode,
    },
    {
      id: 'cardColors',
      title: '卡片颜色设置',
      icon: '🎨',
      type: 'navigation',
      onPress: () => Alert.alert('卡片颜色设置', '您可以在新增灵感时选择卡片背景色，也可以在灵感详情页面进行修改'),
    },
  ];

  const inspirationSettings: SettingItem[] = [
    {
      id: 'backgroundCustom',
      title: '灵感空间背景自定义',
      icon: '🖼️',
      type: 'navigation',
      onPress: () => setCurrentScreen('background'),
    },
  ];

  const backgroundSubSettings: SettingItem[] = [
    {
      id: 'uploadPhoto',
      title: '上传照片',
      icon: '📁',
      type: 'navigation',
      onPress: () => setCurrentScreen('background'),
    },
    {
      id: 'drawingCreation',
      title: '简笔画创作',
      icon: '✏️',
      type: 'navigation',
      onPress: () => setCurrentScreen('background'),
    },
    {
      id: 'presetImages',
      title: '选择预设图片',
      icon: '🖼️',
      type: 'navigation',
      onPress: () => setCurrentScreen('background'),
    },
  ];

  const contentSettings: SettingItem[] = [
    {
      id: 'tagManagement',
      title: '标签管理',
      icon: '🏷️',
      type: 'navigation',
      onPress: () => setCurrentScreen('tags'),
    },
    {
      id: 'clearData',
      title: '清空数据',
      icon: '🗑️',
      type: 'navigation',
      onPress: () => {
        Alert.alert(
          '确认清空',
          '此操作将删除所有灵感数据，且无法恢复。确定要继续吗？',
          [
            { text: '取消', style: 'cancel' },
            { text: '确定清空', style: 'destructive' }
          ]
        );
      },
    },
  ];

  const aboutSettings: SettingItem[] = [
    {
      id: 'about',
      title: '关于我们',
      icon: 'ℹ️',
      type: 'navigation',
      onPress: () => Alert.alert('关于我们', '灵感空间 v1.0.0\n帮助大学生记录和管理灵感的应用'),
    },
  ];

  const renderSettingItem = (item: SettingItem, isSubItem = false) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.settingItem, 
        isSubItem && styles.subSettingItem,
        { borderBottomColor: colors.border }
      ]}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingLeft}>
        <View style={[
          styles.settingIcon,
          isSubItem && styles.subSettingIcon
        ]}>
          <Text style={styles.settingIconText}>{item.icon}</Text>
        </View>
        <Text style={[
          styles.settingTitle,
          isSubItem && styles.subSettingTitle,
          { color: colors.text }
        ]}>
          {item.title}
        </Text>
      </View>
      
      {item.type === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
        />
      ) : (
        <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
      )}
    </TouchableOpacity>
  );

  const renderSettingSection = (title: string, items: SettingItem[], showSubItems = false) => (
    <View style={styles.settingSection}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
        {items.map((item) => renderSettingItem(item))}
        {showSubItems && (
          <View style={[styles.subItemsContainer, { borderTopColor: colors.border }]}>
            {backgroundSubSettings.map((item) => renderSettingItem(item, true))}
          </View>
        )}
      </View>
    </View>
  );

  // Screen navigation logic
  if (currentScreen === 'background') {
    return (
      <BackgroundCustomScreen
        onBack={() => setCurrentScreen('settings')}
      />
    );
  }

  if (currentScreen === 'theme') {
    return (
      <ThemeSettingsScreen
        onBack={() => setCurrentScreen('settings')}
      />
    );
  }

  if (currentScreen === 'tags') {
    return (
      <TagManagementScreen
        onBack={() => setCurrentScreen('settings')}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerPlaceholder} />
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>设置</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content}>
        {renderSettingSection('通用', generalSettings)}
        {renderSettingSection('灵感空间', inspirationSettings, true)}
        {renderSettingSection('内容管理', contentSettings)}
        {renderSettingSection('关于', aboutSettings)}
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
    borderBottomColor: Colors.border.light,
  },
  headerPlaceholder: {
    width: 40,
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
    color: Colors.foreground.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.subtle.light,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,

  },
  subSettingItem: {
    paddingLeft: 48,
    opacity: 0.8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subSettingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  settingIconText: {
    fontSize: 20,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  subSettingTitle: {
    fontSize: 14,
  },
  settingArrow: {
    fontSize: 20,
  },
  subItemsContainer: {
    borderTopWidth: 1,
  },
});