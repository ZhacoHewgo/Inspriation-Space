import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useInspiration, Inspiration } from '../context/InspirationContext';

interface InspirationDetailScreenProps {
  inspiration: Inspiration;
  onBack: () => void;
  onEdit?: (inspiration: Inspiration) => void;
}

const categories = [
  { id: 'learning', label: '学习', color: '#10b981' },
  { id: 'research', label: '科研', color: '#3b82f6' },
  { id: 'creation', label: '创作', color: '#8b5cf6' },
  { id: 'life', label: '生活', color: '#f59e0b' },
];

export default function InspirationDetailScreen({ 
  inspiration, 
  onBack, 
  onEdit 
}: InspirationDetailScreenProps) {
  const { updateInspiration, deleteInspiration } = useInspiration();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(inspiration.content);
  const [editTitle, setEditTitle] = useState(inspiration.title);

  const categoryInfo = categories.find(cat => cat.id === inspiration.category);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${inspiration.title}\n\n${inspiration.content}`,
        title: '分享灵感',
      });
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这条灵感吗？此操作无法撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            deleteInspiration(inspiration.id);
            onBack();
          },
        },
      ]
    );
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) {
      Alert.alert('提示', '灵感内容不能为空');
      return;
    }

    updateInspiration(inspiration.id, {
      title: editTitle.trim() || editContent.substring(0, 30) + (editContent.length > 30 ? '...' : ''),
      content: editContent.trim(),
    });

    setIsEditing(false);
    Alert.alert('成功', '灵感已更新');
  };

  const handleCancelEdit = () => {
    setEditContent(inspiration.content);
    setEditTitle(inspiration.title);
    setIsEditing(false);
  };

  const renderEditModal = () => (
    <Modal
      visible={isEditing}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.editContainer}>
        <View style={styles.editHeader}>
          <TouchableOpacity onPress={handleCancelEdit}>
            <Text style={styles.editCancelText}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.editTitle}>编辑灵感</Text>
          <TouchableOpacity onPress={handleSaveEdit}>
            <Text style={styles.editSaveText}>保存</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.editContent}>
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>标题</Text>
            <TextInput
              style={styles.editTitleInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="输入标题..."
              placeholderTextColor={Colors.placeholder.light}
            />
          </View>
          
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>内容</Text>
            <TextInput
              style={styles.editContentInput}
              value={editContent}
              onChangeText={setEditContent}
              placeholder="输入灵感内容..."
              placeholderTextColor={Colors.placeholder.light}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>灵感详情</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton}>
            <Text style={styles.actionIcon}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Text style={styles.actionIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Category Badge */}
        <View style={styles.categoryContainer}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: categoryInfo?.color + '20' }
          ]}>
            <View style={[
              styles.categoryDot,
              { backgroundColor: categoryInfo?.color }
            ]} />
            <Text style={[
              styles.categoryText,
              { color: categoryInfo?.color }
            ]}>
              {categoryInfo?.label}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.inspirationTitle}>{inspiration.title}</Text>

        {/* Content */}
        <Text style={styles.inspirationContent}>{inspiration.content}</Text>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            创建时间: {inspiration.createdAt.toLocaleString('zh-CN')}
          </Text>
          {inspiration.updatedAt.getTime() !== inspiration.createdAt.getTime() && (
            <Text style={styles.metadataText}>
              更新时间: {inspiration.updatedAt.toLocaleString('zh-CN')}
            </Text>
          )}
        </View>
      </ScrollView>

      {renderEditModal()}
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
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
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
  actionIcon: {
    fontSize: 18,
    color: Colors.foreground.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inspirationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.foreground.light,
    marginBottom: 16,
    lineHeight: 32,
  },
  inspirationContent: {
    fontSize: 16,
    color: Colors.foreground.light,
    lineHeight: 24,
    marginBottom: 32,
  },
  metadata: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: 8,
  },
  metadataText: {
    fontSize: 14,
    color: Colors.subtle.light,
  },
  // Edit Modal Styles
  editContainer: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  editCancelText: {
    fontSize: 16,
    color: Colors.primary,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.foreground.light,
  },
  editSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  editContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  editSection: {
    marginTop: 24,
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground.light,
    marginBottom: 8,
  },
  editTitleInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.foreground.light,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  editContentInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.foreground.light,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minHeight: 200,
    textAlignVertical: 'top',
  },
});