import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface InspirationDetailScreenProps {
  navigation: any;
  route: {
    params: {
      inspiration: {
        id: string;
        title: string;
        content: string;
        category: string;
        time: string;
        date: string;
      };
    };
  };
}

export default function InspirationDetailScreen({ 
  navigation,
  route
}: InspirationDetailScreenProps) {
  const { inspiration } = route.params;
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return '#10b981';
      case 'research': return '#3b82f6';
      case 'creation': return '#8b5cf6';
      case 'life': return '#f59e0b';
      default: return Colors.primary;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'learning': return '学习';
      case 'research': return '科研';
      case 'creation': return '创作';
      case 'life': return '生活';
      default: return category;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>灵感详情</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Category Tag */}
        <View style={styles.categoryContainer}>
          <View style={[
            styles.categoryTag,
            { backgroundColor: `${getCategoryColor(inspiration.category)}20` }
          ]}>
            <Text style={[
              styles.categoryText,
              { color: getCategoryColor(inspiration.category) }
            ]}>
              {getCategoryName(inspiration.category)}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.inspirationContent}>
          {inspiration.content}
        </Text>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            创建时间：{inspiration.date} {inspiration.time}
          </Text>
          <Text style={styles.metadataText}>
            最后修改：{inspiration.date} {inspiration.time}
          </Text>
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
    borderBottomColor: `${Colors.primary}33`,
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
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // Compensate for back button width
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inspirationContent: {
    fontSize: 16,
    lineHeight: 24,
    color: `${Colors.foreground.light}CC`,
    marginBottom: 32,
  },
  metadata: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  metadataText: {
    fontSize: 14,
    color: Colors.subtle.light,
    marginBottom: 8,
  },
});