import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useInspiration } from '../context/InspirationContext';

interface InspirationCard {
  id: string;
  title: string;
  content: string;
  category: 'learning' | 'research' | 'creation' | 'life';
  time: string;
  date: string;
}

interface CategoryModule {
  id: 'learning' | 'research' | 'creation' | 'life';
  title: string;
  count: number;
  color: string;
  backgroundImage: string;
}

const categoryModules: CategoryModule[] = [
  {
    id: 'learning',
    title: '学习',
    count: 23,
    color: '#10b981',
    backgroundImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
  },
  {
    id: 'research',
    title: '科研',
    count: 15,
    color: '#3b82f6',
    backgroundImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop',
  },
  {
    id: 'creation',
    title: '创作',
    count: 8,
    color: '#8b5cf6',
    backgroundImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
  },
  {
    id: 'life',
    title: '生活',
    count: 31,
    color: '#f59e0b',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  },
];



interface HomeScreenProps {
  navigation?: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { inspirations, addInspiration } = useInspiration();
  const [viewMode, setViewMode] = useState<'module' | 'calendar'>('module');
  const [searchText, setSearchText] = useState('');
  const [showNewInspirationModal, setShowNewInspirationModal] = useState(false);
  const [newInspirationText, setNewInspirationText] = useState('');
  const [filteredInspirations, setFilteredInspirations] = useState(inspirations);

  useEffect(() => {
    setFilteredInspirations(inspirations);
  }, [inspirations]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredInspirations(inspirations);
    } else {
      const filtered = inspirations.filter(inspiration =>
        inspiration.title.toLowerCase().includes(text.toLowerCase()) ||
        inspiration.content.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredInspirations(filtered);
    }
  };

  const handleSaveInspiration = () => {
    if (newInspirationText.trim()) {
      addInspiration({
        title: newInspirationText.substring(0, 30) + (newInspirationText.length > 30 ? '...' : ''),
        content: newInspirationText,
        category: 'life',
        color: '#ffffff',
      });
      
      setNewInspirationText('');
      setShowNewInspirationModal(false);
    }
  };

  const handleInspirationPress = (inspiration: any) => {
    if (navigation) {
      const formattedInspiration = {
        id: inspiration.id,
        title: inspiration.title,
        content: inspiration.content,
        category: inspiration.category,
        time: inspiration.createdAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        date: inspiration.createdAt.toLocaleDateString('zh-CN'),
      };
      navigation.navigate('InspirationDetail', { inspiration: formattedInspiration });
    }
  };

  const handleDataStatisticsPress = () => {
    if (navigation) {
      navigation.navigate('DataStatistics');
    }
  };

  const renderNewInspirationModal = () => (
    <Modal
      visible={showNewInspirationModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowNewInspirationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>新增灵感</Text>
          <TextInput
            style={styles.modalTextInput}
            placeholder="在这里输入你的灵感…"
            placeholderTextColor={Colors.placeholder.light}
            value={newInspirationText}
            onChangeText={setNewInspirationText}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setNewInspirationText('');
                setShowNewInspirationModal(false);
              }}
            >
              <Text style={styles.modalCancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleSaveInspiration}
            >
              <Text style={styles.modalSaveButtonText}>保存灵感</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleModulePress = (categoryId: string) => {
    const categoryInspirations = inspirations.filter(inspiration => inspiration.category === categoryId);
    setFilteredInspirations(categoryInspirations);
    setViewMode('calendar');
  };

  const renderModuleView = () => (
    <View style={styles.moduleGrid}>
      {categoryModules.map((module) => {
        const actualCount = inspirations.filter(inspiration => inspiration.category === module.id).length;
        return (
          <TouchableOpacity 
            key={module.id} 
            style={styles.moduleCard}
            onPress={() => handleModulePress(module.id)}
          >
            <ImageBackground
              source={{ uri: module.backgroundImage }}
              style={styles.moduleBackground}
              imageStyle={styles.moduleBackgroundImage}
            >
              <View style={styles.moduleOverlay} />
              <View style={styles.moduleContent}>
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleCount}>{actualCount}个灵感</Text>
                </View>
                <TouchableOpacity style={styles.moduleEditButton}>
                  <Text style={styles.moduleEditIcon}>✏️</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderCalendarView = () => {
    const today = 17;
    const daysInMonth = 31;
    const startDay = 2; // October 1st is Tuesday (0=Sunday, 1=Monday, etc.)
    
    const calendarDays = [];
    
    // Previous month days
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(
        <View key={`prev-${i}`} style={styles.calendarDay}>
          <Text style={styles.calendarDayTextInactive}>{29 + i}</Text>
        </View>
      );
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today;
      const hasInspiration = [3, 7, 11, 15, 20, 31].includes(day);
      
      calendarDays.push(
        <View key={day} style={styles.calendarDay}>
          <View style={[
            styles.calendarDayContainer,
            isToday && styles.calendarDayToday
          ]}>
            <Text style={[
              styles.calendarDayText,
              isToday && styles.calendarDayTextToday
            ]}>
              {day}
            </Text>
          </View>
          {hasInspiration && (
            <View style={[
              styles.inspirationDot,
              day === 7 || day === 20 ? styles.inspirationDotActive :
              day === 3 || day === 11 ? styles.inspirationDotMedium :
              styles.inspirationDotLight
            ]} />
          )}
        </View>
      );
    }
    
    // Next month days
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
    for (let i = daysInMonth + startDay; i < totalCells; i++) {
      calendarDays.push(
        <View key={`next-${i}`} style={styles.calendarDay}>
          <Text style={styles.calendarDayTextInactive}>{i - daysInMonth - startDay + 1}</Text>
        </View>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <View style={styles.calendarNavigation}>
            <TouchableOpacity style={styles.calendarNavButton}>
              <Text style={styles.calendarNavText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>2024年10月</Text>
            <TouchableOpacity style={styles.calendarNavButton}>
              <Text style={styles.calendarNavText}>›</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.todayButton}>今天</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.calendarWeekHeader}>
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {calendarDays}
        </View>
      </View>
    );
  };

  const renderInspirationsList = () => (
    <View style={styles.inspirationsSection}>
      <Text style={styles.sectionTitle}>
        {viewMode === 'calendar' ? '最近的灵感' : '筛选结果'}
      </Text>
      {filteredInspirations.map((inspiration) => (
        <TouchableOpacity 
          key={inspiration.id} 
          style={styles.inspirationCard}
          onPress={() => handleInspirationPress(inspiration)}
        >
          <Text style={styles.inspirationTitle}>{inspiration.title}</Text>
          <Text style={styles.inspirationContent} numberOfLines={3}>
            {inspiration.content}
          </Text>
          <Text style={styles.inspirationTime}>
            {inspiration.createdAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
      ))}
      {filteredInspirations.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>暂无灵感记录</Text>
          <Text style={styles.emptyStateSubtext}>点击右下角的 + 按钮开始记录你的第一个灵感吧！</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>灵感空间</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={handleDataStatisticsPress}>
              <Text style={styles.headerButtonIcon}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setViewMode(viewMode === 'calendar' ? 'module' : 'calendar')}
            >
              <Text style={styles.headerButtonIcon}>📅</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="查找灵感..."
            placeholderTextColor={Colors.placeholder.light}
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        
        {/* Filter and Sort Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⚙️</Text>
            <Text style={styles.controlText}>筛选</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>↕️</Text>
            <Text style={styles.controlText}>排序</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>☑️</Text>
            <Text style={styles.controlText}>批量操作</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Welcome Message */}
        <Text style={styles.welcomeText}>
          欢迎来到灵感空间，请记录下你每一个宝贵的灵感。
        </Text>

        {/* Content based on view mode */}
        {viewMode === 'module' ? renderModuleView() : renderCalendarView()}
        {viewMode === 'calendar' && renderInspirationsList()}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={() => setShowNewInspirationModal(true)}
      >
        <Text style={styles.floatingAddButtonText}>+</Text>
      </TouchableOpacity>

      {/* New Inspiration Modal */}
      {renderNewInspirationModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    backgroundColor: `${Colors.background.light}CC`,
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
    color: Colors.foreground.light,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerButtonIcon: {
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.foreground.light,
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
    color: Colors.subtle.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[200],
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  viewToggleButtonActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.subtle.light,
  },
  viewToggleTextActive: {
    color: Colors.primary,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.subtle.light,
    marginBottom: 16,
  },
  calendarContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarNavButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarNavText: {
    fontSize: 18,
    color: Colors.subtle.light,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.foreground.light,
  },
  todayButton: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtle.light,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  calendarDayContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  calendarDayToday: {
    backgroundColor: Colors.primary,
  },
  calendarDayText: {
    fontSize: 14,
    color: Colors.foreground.light,
  },
  calendarDayTextToday: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  calendarDayTextInactive: {
    fontSize: 14,
    color: Colors.gray[400],
  },
  inspirationDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  inspirationDotActive: {
    backgroundColor: Colors.primary,
  },
  inspirationDotMedium: {
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  inspirationDotLight: {
    backgroundColor: Colors.primary,
    opacity: 0.2,
  },
  inspirationsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.foreground.light,
    marginBottom: 8,
  },
  inspirationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.foreground.light,
    marginBottom: 8,
  },
  inspirationContent: {
    fontSize: 14,
    color: Colors.subtle.light,
    lineHeight: 20,
    marginBottom: 8,
  },
  inspirationTime: {
    fontSize: 12,
    color: Colors.gray[400],
  },
  // Module View Styles
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingVertical: 16,
  },
  moduleCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleBackground: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  moduleBackgroundImage: {
    borderRadius: 12,
  },
  moduleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  moduleContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  moduleCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  moduleEditButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleEditIcon: {
    fontSize: 16,
  },
  // Floating Add Button
  floatingAddButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingAddButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.foreground.light,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalTextInput: {
    height: 160,
    backgroundColor: Colors.gray[100],
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.foreground.light,
    textAlignVertical: 'top',
    marginBottom: 24,
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
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.subtle.light,
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.subtle.light,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.subtle.light,
    textAlign: 'center',
    lineHeight: 20,
  },
});