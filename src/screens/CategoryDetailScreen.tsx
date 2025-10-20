import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInspiration } from '../context/InspirationContext';
import { useTheme } from '../context/ThemeContext';
import { useBackground } from '../context/BackgroundContext';
import { getResponsiveStyles, getWebStyles } from '../utils/responsive';

interface CategoryDetailScreenProps {
  category: string;
  onBack: () => void;
  onInspirationPress: (inspiration: any) => void;
}

const categoryLabels = {
  learning: '学习',
  research: '科研',
  creation: '创作',
  life: '生活',
};



export default function CategoryDetailScreen({ 
  category, 
  onBack, 
  onInspirationPress 
}: CategoryDetailScreenProps) {
  const { inspirations } = useInspiration();
  const { colors } = useTheme();
  const { categoryBackgrounds } = useBackground();
  const responsiveStyles = getResponsiveStyles();
  const webStyles = getWebStyles();
  const [searchText, setSearchText] = useState('');
  const [filteredInspirations, setFilteredInspirations] = useState(
    inspirations.filter(inspiration => inspiration.category === category)
  );

  useEffect(() => {
    let filtered = inspirations.filter(inspiration => inspiration.category === category);
    
    if (searchText.trim() !== '') {
      filtered = filtered.filter(inspiration =>
        inspiration.title.toLowerCase().includes(searchText.toLowerCase()) ||
        inspiration.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredInspirations(filtered);
  }, [inspirations, category, searchText]);

  const categoryInfo = {
    label: categoryLabels[category as keyof typeof categoryLabels],
    background: categoryBackgrounds[category],
  };

  const getCategoryColor = (cat: string) => {
    const categoryColors = {
      learning: '#10b981',
      research: '#3b82f6', 
      creation: '#8b5cf6',
      life: '#f59e0b',
    };
    return categoryColors[cat as keyof typeof categoryColors] || '#6b7280';
  };

  const categoryColor = getCategoryColor(category);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Category Background */}
      <View style={styles.headerContainer}>
        <ImageBackground
          source={{ uri: categoryInfo.background }}
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}
        >
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{categoryInfo.label}</Text>
              <Text style={styles.headerSubtitle}>
                {filteredInspirations.length} 个灵感
              </Text>
            </View>
            <View style={styles.headerPlaceholder} />
          </View>
        </ImageBackground>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={`在${categoryInfo.label}中搜索...`}
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Inspirations List */}
      <ScrollView style={[styles.content, webStyles.container]}>
        {filteredInspirations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateIcon, { color: categoryColor }]}>💡</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              {searchText ? '没有找到相关灵感' : `暂无${categoryInfo.label}类别的灵感`}
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
              {searchText ? '尝试使用其他关键词搜索' : '点击底部的 + 按钮开始记录第一个灵感'}
            </Text>
          </View>
        ) : (
          <View style={styles.inspirationsList}>
            {filteredInspirations.map((inspiration) => (
              <TouchableOpacity
                key={inspiration.id}
                style={[
                  styles.inspirationCard,
                  { backgroundColor: inspiration.color || colors.card, borderColor: colors.border }
                ]}
                onPress={() => onInspirationPress(inspiration)}
              >
                <View style={styles.cardHeader}>
                  <View style={[
                    styles.categoryBadge,
                    { backgroundColor: categoryColor + '20' }
                  ]}>
                    <View style={[
                      styles.categoryDot,
                      { backgroundColor: categoryColor }
                    ]} />
                    <Text style={[
                      styles.categoryBadgeText,
                      { color: categoryColor }
                    ]}>
                      {categoryInfo.label}
                    </Text>
                  </View>
                  <Text style={[styles.inspirationTime, { color: colors.textSecondary }]}>
                    {inspiration.createdAt.toLocaleTimeString('zh-CN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                
                <Text style={[styles.inspirationTitle, { color: colors.text }]}>
                  {inspiration.title}
                </Text>
                <Text style={[styles.inspirationContent, { color: colors.textSecondary }]} numberOfLines={4}>
                  {inspiration.content}
                </Text>
                
                <View style={styles.cardFooter}>
                  <Text style={[styles.inspirationDate, { color: colors.textSecondary }]}>
                    {inspiration.createdAt.toLocaleDateString('zh-CN')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 200,
  },
  headerBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerBackgroundImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerPlaceholder: {
    width: 40,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  inspirationsList: {
    paddingBottom: 24,
  },
  inspirationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inspirationTime: {
    fontSize: 12,
  },
  inspirationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  inspirationContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inspirationDate: {
    fontSize: 12,
  },
});