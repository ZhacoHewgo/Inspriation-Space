import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface DataStatisticsScreenProps {
  navigation: any;
}

export default function DataStatisticsScreen({ navigation }: DataStatisticsScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'total'>('week');

  const weeklyData = [
    { day: '周一', value: 30, label: '周一' },
    { day: '周二', value: 40, label: '周二' },
    { day: '周三', value: 80, label: '周三', active: true },
    { day: '周四', value: 60, label: '周四' },
    { day: '周五', value: 70, label: '周五' },
    { day: '周六', value: 50, label: '周六' },
    { day: '周日', value: 40, label: '周日' },
  ];

  const categoryData = [
    { name: '学习', percentage: 30, color: '#10b981' },
    { name: '生活', percentage: 60, color: '#f59e0b' },
    { name: '工作', percentage: 30, color: '#3b82f6' },
    { name: '兴趣', percentage: 10, color: '#8b5cf6' },
    { name: '其他', percentage: 10, color: '#6b7280' },
  ];

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>本周灵感记录数量</Text>
      <Text style={styles.chartSubtitle}>本周</Text>
      <Text style={styles.chartValue}>15</Text>
      
      <View style={styles.barChart}>
        {weeklyData.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View 
              style={[
                styles.bar,
                { 
                  height: `${item.value}%`,
                  backgroundColor: item.active ? Colors.primary : `${Colors.primary}33`
                }
              ]} 
            />
            <Text style={[
              styles.barLabel,
              item.active && styles.barLabelActive
            ]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCategoryChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>灵感类别分布</Text>
      <Text style={styles.chartSubtitle}>本周</Text>
      <Text style={styles.chartValue}>5</Text>
      
      <View style={styles.categoryChart}>
        {categoryData.map((item, index) => (
          <View key={index} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { 
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>数据统计</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Period Selector */}
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
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Charts Grid */}
        <View style={styles.chartsGrid}>
          {renderBarChart()}
          {renderCategoryChart()}
          
          {/* Summary Cards */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>总记录数</Text>
            <Text style={styles.summaryValue}>120</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>平均每日记录数</Text>
            <Text style={styles.summaryValue}>2.5</Text>
          </View>
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
  backButtonText: {
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
    paddingTop: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: `${Colors.gray[200]}80`,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
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
  chartsGrid: {
    gap: 16,
  },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.foreground.light,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: Colors.subtle.light,
    marginBottom: 8,
  },
  chartValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.foreground.light,
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    gap: 12,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 2,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.subtle.light,
  },
  barLabelActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  categoryChart: {
    gap: 12,
    paddingTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.subtle.light,
    width: 40,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.gray[200],
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.foreground.light,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.foreground.light,
  },
});