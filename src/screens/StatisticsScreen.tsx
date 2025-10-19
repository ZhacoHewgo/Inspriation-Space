import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useInspiration } from '../context/InspirationContext';

interface StatisticsScreenProps {
  onBack: () => void;
}

type TimePeriod = 'week' | 'month' | 'total';

const categories = [
  { id: 'learning', label: '学习', color: '#10b981' },
  { id: 'research', label: '科研', color: '#3b82f6' },
  { id: 'creation', label: '创作', color: '#8b5cf6' },
  { id: 'life', label: '生活', color: '#f59e0b' },
];

export default function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  const { inspirations } = useInspiration();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');

  const statistics = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'total':
        startDate = new Date(0);
        break;
    }

    const filteredInspirations = inspirations.filter(
      inspiration => inspiration.createdAt >= startDate
    );

    // Category distribution
    const categoryStats = categories.map(category => {
      const count = filteredInspirations.filter(
        inspiration => inspiration.category === category.id
      ).length;
      return {
        ...category,
        count,
        percentage: filteredInspirations.length > 0 ? (count / filteredInspirations.length) * 100 : 0,
      };
    });

    // Daily stats for the week
    const dailyStats = [];
    if (selectedPeriod === 'week') {
      const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const count = inspirations.filter(
          inspiration => inspiration.createdAt >= dayStart && inspiration.createdAt < dayEnd
        ).length;

        dailyStats.push({
          day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
          count,
          isToday: date.toDateString() === now.toDateString(),
        });
      }
    }

    const totalCount = filteredInspirations.length;
    const averageDaily = selectedPeriod === 'week' ? totalCount / 7 : 
                       selectedPeriod === 'month' ? totalCount / now.getDate() :
                       totalCount / Math.max(1, Math.ceil((now.getTime() - (inspirations[inspirations.length - 1]?.createdAt.getTime() || now.getTime())) / (24 * 60 * 60 * 1000)));

    return {
      totalCount,
      averageDaily: Math.round(averageDaily * 10) / 10,
      categoryStats,
      dailyStats,
    };
  }, [inspirations, selectedPeriod]);

  const maxDailyCount = Math.max(...statistics.dailyStats.map(day => day.count), 1);

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {[
        { key: 'week', label: '周' },
        { key: 'month', label: '月' },
        { key: 'total', label: '总览' },
      ].map((period) => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.periodButton,
            selectedPeriod === period.key && styles.periodButtonActive,
          ]}
          onPress={() => setSelectedPeriod(period.key as TimePeriod)}
        >
          <Text style={[
            styles.periodButtonText,
            selectedPeriod === period.key && styles.periodButtonTextActive,
          ]}>
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderWeeklyChart = () => {
    if (selectedPeriod !== 'week') return null;

    return (
      <View style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>本周灵感记录数量</Text>
          <Text style={styles.cardSubtitle}>本周</Text>
        </View>
        <Text style={styles.cardMainNumber}>{statistics.totalCount}</Text>
        
        <View style={styles.chartContainer}>
          {statistics.dailyStats.map((day, index) => (
            <View key={index} style={styles.chartBar}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(day.count / maxDailyCount) * 100}%`,
                    backgroundColor: day.isToday ? Colors.primary : Colors.primary + '40',
                  },
                ]}
              />
              <Text style={[
                styles.chartLabel,
                day.isToday && styles.chartLabelActive,
              ]}>
                {day.day}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderCategoryChart = () => (
    <View style={styles.chartCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>灵感类别分布</Text>
        <Text style={styles.cardSubtitle}>
          {selectedPeriod === 'week' ? '本周' : 
           selectedPeriod === 'month' ? '本月' : '总计'}
        </Text>
      </View>
      <Text style={styles.cardMainNumber}>{statistics.categoryStats.length}</Text>
      
      <View style={styles.categoryList}>
        {statistics.categoryStats.map((category) => (
          <View key={category.id} style={styles.categoryItem}>
            <Text style={styles.categoryLabel}>{category.label}</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${category.percentage}%`,
                    backgroundColor: category.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.categoryCount}>{category.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>总记录数</Text>
        <Text style={styles.summaryNumber}>{statistics.totalCount}</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>平均每日记录数</Text>
        <Text style={styles.summaryNumber}>{statistics.averageDaily}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>数据统计</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {renderPeriodSelector()}
        
        <View style={styles.chartsContainer}>
          {renderWeeklyChart()}
          {renderCategoryChart()}
          {renderSummaryCards()}
        </View>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: Colors.foreground.light,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.foreground.light,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[200],
    borderRadius: 8,
    padding: 4,
    marginVertical: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtle.light,
  },
  periodButtonTextActive: {
    color: Colors.white,
  },
  chartsContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground.light,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.subtle.light,
  },
  cardMainNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.foreground.light,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  bar: {
    flex: 1,
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.subtle.light,
    marginTop: 8,
  },
  chartLabelActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtle.light,
    width: 40,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.foreground.light,
    width: 24,
    textAlign: 'right',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground.light,
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.foreground.light,
  },
});