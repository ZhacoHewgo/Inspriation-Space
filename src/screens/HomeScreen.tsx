import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInspiration } from '../context/InspirationContext';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../context/ModalContext';
import { useBackground } from '../context/BackgroundContext';
import InspirationDetailScreen from './InspirationDetailScreen';
import StatisticsScreen from './StatisticsScreen';
import NotificationScreen from './NotificationScreen';
import DrawingScreen from './DrawingScreen';
import SettingsNavigationScreen from './SettingsNavigationScreen';
import CategoryDetailScreen from './CategoryDetailScreen';



const categoryLabels = {
  learning: '学习',
  research: '科研',
  creation: '创作',
  life: '生活',
};

export default function HomeScreen() {
  const { inspirations, addInspiration } = useInspiration();
  const { colors } = useTheme();
  const { showAddInspirationModal, setShowAddInspirationModal } = useModal();
  const { categoryBackgrounds } = useBackground();
  const [searchText, setSearchText] = useState('');
  const [newInspirationText, setNewInspirationText] = useState('');
  const [newInspirationCategory, setNewInspirationCategory] = useState<'learning' | 'research' | 'creation' | 'life'>('life');
  const [newInspirationColor, setNewInspirationColor] = useState('#ffffff');
  const [filteredInspirations, setFilteredInspirations] = useState(inspirations);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'detail' | 'statistics' | 'notifications' | 'drawing' | 'settings' | 'category'>('home');
  const [selectedInspiration, setSelectedInspiration] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentCategoryView, setCurrentCategoryView] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    handleSearch(searchText);
  }, [inspirations, selectedCategory, sortBy, sortOrder]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    let filtered = inspirations;

    // Apply text filter
    if (text.trim() !== '') {
      filtered = filtered.filter(inspiration =>
        inspiration.title.toLowerCase().includes(text.toLowerCase()) ||
        inspiration.content.toLowerCase().includes(text.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(inspiration => inspiration.category === selectedCategory);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredInspirations(filtered);
  };

  const handleSaveInspiration = () => {
    if (newInspirationText.trim()) {
      addInspiration({
        title: newInspirationText.substring(0, 30) + (newInspirationText.length > 30 ? '...' : ''),
        content: newInspirationText,
        category: newInspirationCategory,
        color: newInspirationColor,
      });
      
      setNewInspirationText('');
      setNewInspirationCategory('life');
      setNewInspirationColor('#ffffff');
      setShowAddInspirationModal(false);
    }
  };

  const getCategoryCount = (category: string) => {
    return inspirations.filter(inspiration => inspiration.category === category).length;
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.filterModal, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>筛选灵感</Text>
          
          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>按类别筛选</Text>
          <View style={styles.categoryFilters}>
            <TouchableOpacity
              style={[
                styles.categoryFilterButton,
                !selectedCategory && styles.categoryFilterButtonActive,
                { borderColor: colors.border }
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[
                styles.categoryFilterText,
                { color: !selectedCategory ? colors.primary : colors.textSecondary }
              ]}>
                全部
              </Text>
            </TouchableOpacity>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryFilterButton,
                  selectedCategory === key && styles.categoryFilterButtonActive,
                  { borderColor: colors.border }
                ]}
                onPress={() => setSelectedCategory(key)}
              >
                <Text style={[
                  styles.categoryFilterText,
                  { color: selectedCategory === key ? colors.primary : colors.textSecondary }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalCancelButton, { borderColor: colors.border }]}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={[styles.modalCancelButtonText, { color: colors.textSecondary }]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSaveButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowFilterModal(false);
                handleSearch(searchText);
              }}
            >
              <Text style={styles.modalSaveButtonText}>应用</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.filterModal, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>排序方式</Text>
          
          <View style={styles.sortOptions}>
            {[
              { key: 'date', label: '按时间排序' },
              { key: 'title', label: '按标题排序' },
              { key: 'category', label: '按类别排序' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  { borderBottomColor: colors.border }
                ]}
                onPress={() => setSortBy(option.key as any)}
              >
                <Text style={[
                  styles.sortOptionText,
                  { color: sortBy === option.key ? colors.primary : colors.text }
                ]}>
                  {option.label}
                </Text>
                {sortBy === option.key && (
                  <Text style={[styles.sortOptionCheck, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sortOrderContainer}>
            <TouchableOpacity
              style={[
                styles.sortOrderButton,
                sortOrder === 'desc' && styles.sortOrderButtonActive,
                { borderColor: colors.border, backgroundColor: sortOrder === 'desc' ? colors.primary : 'transparent' }
              ]}
              onPress={() => setSortOrder('desc')}
            >
              <Text style={[
                styles.sortOrderText,
                { color: sortOrder === 'desc' ? '#ffffff' : colors.textSecondary }
              ]}>
                降序
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortOrderButton,
                sortOrder === 'asc' && styles.sortOrderButtonActive,
                { borderColor: colors.border, backgroundColor: sortOrder === 'asc' ? colors.primary : 'transparent' }
              ]}
              onPress={() => setSortOrder('asc')}
            >
              <Text style={[
                styles.sortOrderText,
                { color: sortOrder === 'asc' ? '#ffffff' : colors.textSecondary }
              ]}>
                升序
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalCancelButton, { borderColor: colors.border }]}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={[styles.modalCancelButtonText, { color: colors.textSecondary }]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSaveButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowSortModal(false);
                handleSearch(searchText);
              }}
            >
              <Text style={styles.modalSaveButtonText}>应用</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const colorOptions = [
    '#ffffff', '#f3f4f6', '#fef3c7', '#fecaca', 
    '#fed7d7', '#e0e7ff', '#ddd6fe', '#d1fae5'
  ];

  const renderNewInspirationModal = () => (
    <Modal
      visible={showAddInspirationModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAddInspirationModal(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          setShowAddInspirationModal(false);
        }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={[styles.modalTitle, { color: colors.text }]}>新增灵感</Text>
          
          {/* 类别选择 */}
          <Text style={[styles.modalSectionTitle, { color: colors.text }]}>选择类别</Text>
          <View style={styles.categorySelection}>
            {Object.entries(categoryLabels).map(([key, label]) => {
              const categoryColors = {
                learning: '#10b981',
                research: '#3b82f6', 
                creation: '#8b5cf6',
                life: '#f59e0b',
              };
              const categoryColor = categoryColors[key as keyof typeof categoryColors];
              
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.categoryOption,
                    newInspirationCategory === key && styles.categoryOptionActive,
                    { borderColor: newInspirationCategory === key ? categoryColor : colors.border }
                  ]}
                  onPress={() => setNewInspirationCategory(key as any)}
                >
                  <View style={[styles.categoryOptionDot, { backgroundColor: categoryColor }]} />
                  <Text style={[
                    styles.categoryOptionText,
                    { color: newInspirationCategory === key ? categoryColor : colors.textSecondary }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 颜色选择 */}
          <Text style={[styles.modalSectionTitle, { color: colors.text }]}>选择背景色</Text>
          <View style={styles.colorSelection}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  newInspirationColor === color && styles.colorOptionActive,
                  { borderColor: newInspirationColor === color ? colors.primary : colors.border }
                ]}
                onPress={() => setNewInspirationColor(color)}
              >
                {newInspirationColor === color && (
                  <Text style={[styles.colorCheckmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* 内容输入 */}
          <Text style={[styles.modalSectionTitle, { color: colors.text }]}>灵感内容</Text>
          <TextInput
            style={[
              styles.modalTextInput, 
              { 
                backgroundColor: newInspirationColor, 
                color: colors.text, 
                borderColor: colors.border 
              }
            ]}
            placeholder="在这里输入你的灵感…"
            placeholderTextColor={colors.textSecondary}
            value={newInspirationText}
            onChangeText={setNewInspirationText}
            multiline
            textAlignVertical="top"
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalCancelButton, { borderColor: colors.border }]}
              onPress={() => {
                setNewInspirationText('');
                setNewInspirationCategory('life');
                setNewInspirationColor('#ffffff');
                setShowAddInspirationModal(false);
              }}
            >
              <Text style={[styles.modalCancelButtonText, { color: colors.textSecondary }]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSaveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveInspiration}
            >
              <Text style={styles.modalSaveButtonText}>保存灵感</Text>
            </TouchableOpacity>
          </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderCategoryGrid = () => (
    <View style={styles.categoryGrid}>
      {Object.entries(categoryLabels).map(([key, label]) => (
        <TouchableOpacity
          key={key}
          style={styles.categoryCard}
          onPress={() => {
            setCurrentCategoryView(key);
            setCurrentScreen('category');
          }}
        >
          <ImageBackground
            source={{ uri: categoryBackgrounds[key] }}
            style={styles.categoryBackground}
            imageStyle={styles.categoryBackgroundImage}
          >
            <View style={styles.categoryOverlay} />
            <View style={styles.categoryContent}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{label}</Text>
                <Text style={styles.categoryCount}>{getCategoryCount(key)}个灵感</Text>
              </View>
              <TouchableOpacity 
                style={styles.categoryEditButton}
                onPress={() => Alert.alert('背景自定义', '请前往设置页面进行背景自定义', [
                  { text: '取消', style: 'cancel' },
                  { text: '去设置', onPress: () => setCurrentScreen('settings') }
                ])}
              >
                <Text style={styles.categoryEditIcon}>✎</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );

  const getCategoryInfo = (category: string) => {
    const categoryColors = {
      learning: '#10b981',
      research: '#3b82f6', 
      creation: '#8b5cf6',
      life: '#f59e0b',
    };
    return {
      label: categoryLabels[category as keyof typeof categoryLabels],
      color: categoryColors[category as keyof typeof categoryColors] || '#6b7280',
    };
  };

  const renderInspirationsList = () => (
    <View style={styles.inspirationsSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>最近的灵感</Text>
        <TouchableOpacity 
          style={[styles.statisticsButton, { backgroundColor: colors.primary + '20' }]}
          onPress={() => setCurrentScreen('statistics')}
        >
          <Text style={styles.statisticsIcon}>📊</Text>
          <Text style={[styles.statisticsText, { color: colors.primary }]}>数据统计</Text>
        </TouchableOpacity>
      </View>
      {filteredInspirations.map((inspiration) => {
        const categoryInfo = getCategoryInfo(inspiration.category);
        return (
          <TouchableOpacity 
            key={inspiration.id} 
            style={[styles.inspirationCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => {
              setSelectedInspiration(inspiration);
              setCurrentScreen('detail');
            }}
          >
            <View style={styles.cardHeader}>
              <View style={[
                styles.categoryBadge,
                { backgroundColor: categoryInfo.color + '20' }
              ]}>
                <View style={[
                  styles.categoryDot,
                  { backgroundColor: categoryInfo.color }
                ]} />
                <Text style={[
                  styles.categoryBadgeText,
                  { color: categoryInfo.color }
                ]}>
                  {categoryInfo.label}
                </Text>
              </View>
              <Text style={[styles.inspirationTime, { color: colors.textSecondary }]}>
                {inspiration.createdAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <Text style={[styles.inspirationTitle, { color: colors.text }]}>{inspiration.title}</Text>
            <Text style={[styles.inspirationContent, { color: colors.textSecondary }]} numberOfLines={3}>
              {inspiration.content}
            </Text>
          </TouchableOpacity>
        );
      })}
      {filteredInspirations.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>暂无灵感记录</Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>点击右下角的 + 按钮开始记录你的第一个灵感吧！</Text>
        </View>
      )}
    </View>
  );

  // Screen navigation logic
  if (currentScreen === 'detail' && selectedInspiration) {
    return (
      <InspirationDetailScreen
        inspiration={selectedInspiration}
        onBack={() => setCurrentScreen('home')}
      />
    );
  }

  if (currentScreen === 'statistics') {
    return (
      <StatisticsScreen
        onBack={() => setCurrentScreen('home')}
      />
    );
  }

  if (currentScreen === 'notifications') {
    return (
      <NotificationScreen
        onBack={() => setCurrentScreen('home')}
      />
    );
  }

  if (currentScreen === 'drawing') {
    return (
      <DrawingScreen
        onBack={() => setCurrentScreen('home')}
      />
    );
  }

  if (currentScreen === 'settings') {
    return (
      <SettingsNavigationScreen onBack={() => setCurrentScreen('home')} />
    );
  }

  if (currentScreen === 'category' && currentCategoryView) {
    return (
      <CategoryDetailScreen
        category={currentCategoryView}
        onBack={() => setCurrentScreen('home')}
        onInspirationPress={(inspiration) => {
          setSelectedInspiration(inspiration);
          setCurrentScreen('detail');
        }}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background + 'CC' }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>灵感空间</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setCurrentScreen('statistics')}
              >
                <Text style={[styles.headerButtonIcon, { color: colors.text }]}>📊</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => Alert.alert('日历视图', '功能开发中...')}
              >
                <Text style={[styles.headerButtonIcon, { color: colors.text }]}>📅</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setCurrentScreen('notifications')}
              >
                <Text style={[styles.headerButtonIcon, { color: colors.text }]}>🔔</Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="查找灵感..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
          
          {/* Filter and Sort Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Text style={[styles.controlIcon, { color: colors.textSecondary }]}>⚙️</Text>
              <Text style={[styles.controlText, { color: colors.textSecondary }]}>筛选</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setShowSortModal(true)}
            >
              <Text style={[styles.controlIcon, { color: colors.textSecondary }]}>↕️</Text>
              <Text style={[styles.controlText, { color: colors.textSecondary }]}>排序</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => Alert.alert('批量操作', '功能开发中...')}
            >
              <Text style={[styles.controlIcon, { color: colors.textSecondary }]}>☑️</Text>
              <Text style={[styles.controlText, { color: colors.textSecondary }]}>批量操作</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Welcome Message */}
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            欢迎来到灵感空间，请记录下你每一个宝贵的灵感。
          </Text>

          {/* Category Grid */}
          {renderCategoryGrid()}

          {/* Inspirations List */}
          {renderInspirationsList()}
        </ScrollView>



        {/* Modals */}
        {renderNewInspirationModal()}
        {renderFilterModal()}
        {renderSortModal()}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerButtonIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
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
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlIcon: {
    fontSize: 14,
  },
  controlText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 14,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryBackgroundImage: {
    borderRadius: 12,
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoryEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEditIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  inspirationsSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statisticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statisticsIcon: {
    fontSize: 14,
  },
  statisticsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inspirationCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
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
  inspirationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inspirationContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  inspirationTime: {
    fontSize: 12,
  },
  hiddenAddButton: {
    position: 'absolute',
    bottom: -100, // 隐藏按钮，由底部导航栏处理
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingAddButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filterModal: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  categorySelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  categoryOptionActive: {
    borderWidth: 2,
  },
  categoryOptionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  colorSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionActive: {
    borderWidth: 3,
  },
  colorCheckmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalTextInput: {
    height: 120,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 24,
    borderWidth: 1,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryFilterButtonActive: {
    borderColor: '#13a4ec',
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortOptions: {
    marginBottom: 24,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sortOptionText: {
    fontSize: 16,
  },
  sortOptionCheck: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortOrderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  sortOrderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  sortOrderButtonActive: {
    borderColor: '#13a4ec',
  },
  sortOrderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});