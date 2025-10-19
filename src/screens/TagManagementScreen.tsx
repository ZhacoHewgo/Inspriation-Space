import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface TagManagementScreenProps {
  onBack: () => void;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

const mockTags: Tag[] = [
  { id: '1', name: '重要', color: '#ef4444', count: 12 },
  { id: '2', name: '待办', color: '#f59e0b', count: 8 },
  { id: '3', name: '想法', color: '#8b5cf6', count: 15 },
  { id: '4', name: '项目', color: '#3b82f6', count: 6 },
  { id: '5', name: '灵感', color: '#10b981', count: 20 },
  { id: '6', name: '笔记', color: '#6b7280', count: 9 },
];

const tagColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
  '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6'
];

export default function TagManagementScreen({ onBack }: TagManagementScreenProps) {
  const { colors } = useTheme();
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(tagColors[0]);

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: newTagColor,
        count: 0,
      };
      setTags([...tags, newTag]);
      setNewTagName('');
      setNewTagColor(tagColors[0]);
      setShowAddModal(false);
      Alert.alert('成功', '标签已添加');
    }
  };

  const handleEditTag = () => {
    if (editingTag && newTagName.trim()) {
      setTags(tags.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, name: newTagName.trim(), color: newTagColor }
          : tag
      ));
      setNewTagName('');
      setNewTagColor(tagColors[0]);
      setEditingTag(null);
      setShowEditModal(false);
      Alert.alert('成功', '标签已更新');
    }
  };

  const handleDeleteTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
      Alert.alert(
        '删除标签',
        `确定要删除标签"${tag.name}"吗？这将影响${tag.count}个灵感记录。`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '删除',
            style: 'destructive',
            onPress: () => {
              setTags(tags.filter(t => t.id !== tagId));
              Alert.alert('成功', '标签已删除');
            },
          },
        ]
      );
    }
  };

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setShowEditModal(true);
  };

  const renderTagModal = (isEdit: boolean) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (isEdit) {
          setShowEditModal(false);
          setEditingTag(null);
        } else {
          setShowAddModal(false);
        }
        setNewTagName('');
        setNewTagColor(tagColors[0]);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {isEdit ? '编辑标签' : '新增标签'}
          </Text>
          
          <Text style={[styles.modalSectionTitle, { color: colors.text }]}>标签名称</Text>
          <TextInput
            style={[styles.tagNameInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholder="输入标签名称..."
            placeholderTextColor={colors.textSecondary}
            value={newTagName}
            onChangeText={setNewTagName}
          />

          <Text style={[styles.modalSectionTitle, { color: colors.text }]}>标签颜色</Text>
          <View style={styles.colorSelection}>
            {tagColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  newTagColor === color && styles.colorOptionSelected
                ]}
                onPress={() => setNewTagColor(color)}
              >
                {newTagColor === color && (
                  <Text style={styles.colorCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalCancelButton, { borderColor: colors.border }]}
              onPress={() => {
                if (isEdit) {
                  setShowEditModal(false);
                  setEditingTag(null);
                } else {
                  setShowAddModal(false);
                }
                setNewTagName('');
                setNewTagColor(tagColors[0]);
              }}
            >
              <Text style={[styles.modalCancelButtonText, { color: colors.textSecondary }]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSaveButton, { backgroundColor: colors.primary }]}
              onPress={isEdit ? handleEditTag : handleAddTag}
            >
              <Text style={styles.modalSaveButtonText}>
                {isEdit ? '更新' : '添加'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>标签管理</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
          <Text style={[styles.addButtonText, { color: colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* 统计信息 */}
        <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{tags.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>总标签数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {tags.reduce((sum, tag) => sum + tag.count, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>使用次数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {tags.filter(tag => tag.count > 0).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>活跃标签</Text>
          </View>
        </View>

        {/* 标签列表 */}
        <View style={styles.tagsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>所有标签</Text>
          
          {tags.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                暂无标签
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                点击右上角的 + 按钮添加第一个标签
              </Text>
            </View>
          ) : (
            <View style={styles.tagsList}>
              {tags.map((tag) => (
                <View key={tag.id} style={[styles.tagItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.tagInfo}>
                    <View style={styles.tagHeader}>
                      <View style={[styles.tagColorDot, { backgroundColor: tag.color }]} />
                      <Text style={[styles.tagName, { color: colors.text }]}>{tag.name}</Text>
                      <Text style={[styles.tagCount, { color: colors.textSecondary }]}>
                        {tag.count} 次使用
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.tagActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => openEditModal(tag)}
                    >
                      <Text style={[styles.actionIcon, { color: colors.primary }]}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteTag(tag.id)}
                    >
                      <Text style={[styles.actionIcon, { color: '#ef4444' }]}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 使用提示 */}
        <View style={[styles.tipContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tipTitle, { color: colors.text }]}>💡 使用提示</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            • 标签可以帮助您更好地分类和查找灵感{'\n'}
            • 点击标签可以编辑名称和颜色{'\n'}
            • 删除标签不会删除相关的灵感内容{'\n'}
            • 建议创建简洁明了的标签名称
          </Text>
        </View>
      </ScrollView>

      {/* 模态框 */}
      {renderTagModal(false)}
      {renderTagModal(true)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  tagsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  tagsList: {
    gap: 12,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagInfo: {
    flex: 1,
  },
  tagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tagName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  tagCount: {
    fontSize: 12,
  },
  tagActions: {
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
    fontSize: 16,
  },
  tipContainer: {
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
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
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
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
    marginBottom: 8,
    marginTop: 8,
  },
  tagNameInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  colorSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  colorCheckmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
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