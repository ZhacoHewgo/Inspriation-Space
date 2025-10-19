import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface NotificationScreenProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'update' | 'reminder' | 'report' | 'achievement';
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'update',
    title: '应用更新',
    content: '新增了多种创意工具，帮助您更好地记录灵感。',
    date: '2024-01-15',
    isRead: false,
  },
  {
    id: '2',
    type: 'achievement',
    title: '灵感记录提醒',
    content: '您的灵感记录已达到一个新的高峰，请继续努力！',
    date: '2024-01-10',
    isRead: false,
  },
  {
    id: '3',
    type: 'report',
    title: '灵感记录周报',
    content: '本周您共记录了 15 条灵感，其中 5 条被标记为重要。',
    date: '2024-01-05',
    isRead: true,
  },
  {
    id: '4',
    type: 'reminder',
    title: '灵感记录提醒',
    content: '您已经3天没有记录新的灵感了，快来记录一下今天的想法吧！',
    date: '2023-12-20',
    isRead: true,
  },
  {
    id: '5',
    type: 'update',
    title: '应用更新',
    content: '修复了一些已知问题，提升了应用的稳定性和性能。',
    date: '2023-12-15',
    isRead: true,
  },
  {
    id: '6',
    type: 'achievement',
    title: '里程碑达成',
    content: '恭喜您！已经连续记录灵感30天了，坚持就是胜利！',
    date: '2023-12-10',
    isRead: true,
  },
];

const notificationIcons = {
  update: '⚡',
  reminder: '🔔',
  report: '📊',
  achievement: '🎉',
};

const notificationColors = {
  update: Colors.primary,
  reminder: '#f59e0b',
  report: '#10b981',
  achievement: '#8b5cf6',
};

export default function NotificationScreen({ onBack }: NotificationScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const { unreadCount, sortedNotifications } = useMemo(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    const sorted = [...notifications].sort((a, b) => {
      // Unread first, then by date
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return { unreadCount: unread, sortedNotifications: sorted };
  }, [notifications]);

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.notificationItemUnread,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: notificationColors[item.type] + '20' }
      ]}>
        <Text style={[
          styles.icon,
          { color: notificationColors[item.type] }
        ]}>
          {notificationIcons[item.type]}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[
            styles.title,
            !item.isRead && styles.titleUnread,
          ]}>
            {item.title}
          </Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <Text style={styles.content} numberOfLines={2}>
          {item.content}
        </Text>
      </View>
      
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通知</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllRead}>全部已读</Text>
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={styles.placeholder} />}
      </View>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            您有 {unreadCount} 条未读通知
          </Text>
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={sortedNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Empty State */}
      {sortedNotifications.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>暂无通知</Text>
          <Text style={styles.emptySubtitle}>
            当有新的更新或重要提醒时，我们会在这里通知您
          </Text>
        </View>
      )}
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
    backgroundColor: Colors.background.light + 'CC',
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
  markAllRead: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  placeholder: {
    width: 60,
  },
  unreadBanner: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  unreadText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  notificationItemUnread: {
    backgroundColor: Colors.primary + '05',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  icon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground.light,
    flex: 1,
    marginRight: 8,
  },
  titleUnread: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: Colors.subtle.light,
  },
  content: {
    fontSize: 14,
    color: Colors.subtle.light,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.foreground.light,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.subtle.light,
    textAlign: 'center',
    lineHeight: 20,
  },
});