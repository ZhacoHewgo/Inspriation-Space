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

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  type: 'navigation' | 'toggle';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const generalSettings: SettingItem[] = [
    {
      id: 'theme',
      title: '主题设置',
      icon: '🎨',
      type: 'navigation',
      onPress: () => Alert.alert('主题设置', '功能开发中...'),
    },
    {
      id: 'darkMode',
      title: '夜间模式',
      icon: '🌙',
      type: 'toggle',
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      id: 'cardColors',
      title: '卡片颜色设置',
      icon: '🎨',
      type: 'navigation',
      onPress: () => Alert.alert('卡片颜色设置', '功能开发中...'),
    },
  ];

  const inspirationSettings: SettingItem[] = [
    {
      id: 'backgroundCustom',
      title: '灵感空间背景自定义',
      icon: '🖼️',
      type: 'navigation',
      onPress: () => Alert.alert('背景自定义', '功能开发中...'),
    },
  ];

  const backgroundSubSettings: SettingItem[] = [
    {
      id: 'uploadPhoto',
      title: '上传照片',
      icon: '📁',
      type: 'navigation',
      onPress: () => Alert.alert('上传照片', '功能开发中...'),
    },
    {
      id: 'drawingCreation',
      title: '简笔画创作',
      icon: '✏️',
      type: 'navigation',
      onPress: () => Alert.alert('简笔画创作', '功能开发中...'),
    },
    {
      id: 'presetImages',
      title: '选择预设图片',
      icon: '🖼️',
      type: 'navigation',
      onPress: () => Alert.alert('预设图片', '功能开发中...'),
    },
  ];

  const contentSettings: SettingItem[] = [
    {
      id: 'tagManagement',
      title: '标签管理',
      icon: '🏷️',
      type: 'navigation',
      onPress: () => Alert.alert('标签管理', '功能开发中...'),
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
      style={[styles.settingItem, isSubItem && styles.subSettingItem]}
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
          isSubItem && styles.subSettingTitle
        ]}>
          {item.title}
        </Text>
      </View>
      
      {item.type === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: Colors.gray[300], true: Colors.primary }}
          thumbColor={Colors.white}
        />
      ) : (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  const renderSettingSection = (title: string, items: SettingItem[], showSubItems = false) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item) => renderSettingItem(item))}
        {showSubItems && (
          <View style={styles.subItemsContainer}>
            {backgroundSubSettings.map((item) => renderSettingItem(item, true))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerPlaceholder} />
        <Text style={styles.headerTitle}>设置</Text>
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
    backgroundColor: Colors.background.light,
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
    backgroundColor: Colors.white,
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
    borderBottomColor: Colors.gray[100],
  },
  subSettingItem: {
    paddingLeft: 48,
    backgroundColor: Colors.gray[50],
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
    color: Colors.foreground.light,
  },
  subSettingTitle: {
    fontSize: 14,
  },
  settingArrow: {
    fontSize: 20,
    color: Colors.gray[400],
  },
  subItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
});