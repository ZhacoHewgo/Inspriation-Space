import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../context/ModalContext';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { setShowAddInspirationModal } = useModal();

  return (
    <View style={[styles.tabBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
        const isFocused = state.index === index;

        // 中间的加号按钮
        if (route.name === 'AddInspiration') {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.addButton}
              onPress={() => setShowAddInspirationModal(true)}
            >
              <View style={[styles.addButtonContainer, { backgroundColor: colors.primary }]}>
                <Text style={styles.addButtonText}>+</Text>
              </View>
            </TouchableOpacity>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            {/* 图标 */}
            <View style={styles.iconContainer}>
              {route.name === 'Home' && (
                <Text style={[styles.tabIcon, { color: isFocused ? colors.primary : colors.textSecondary }]}>
                  💡
                </Text>
              )}
              {route.name === 'Settings' && (
                <Text style={[styles.tabIcon, { color: isFocused ? colors.primary : colors.textSecondary }]}>
                  ⚙️
                </Text>
              )}
            </View>
            
            {/* 标签 */}
            <Text style={[
              styles.tabLabel,
              { color: isFocused ? colors.primary : colors.textSecondary }
            ]}>
              {typeof label === 'string' ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 2,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});