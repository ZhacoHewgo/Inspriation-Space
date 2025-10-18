import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useInspiration } from '../context/InspirationContext';

const categories = [
  { id: 'learning', label: '学习', color: '#10b981' },
  { id: 'research', label: '科研', color: '#3b82f6' },
  { id: 'creation', label: '创作', color: '#8b5cf6' },
  { id: 'life', label: '生活', color: '#f59e0b' },
];

const colorOptions = [
  '#ffffff', '#f3f4f6', '#fef3c7', '#fecaca', 
  '#fed7d7', '#e0e7ff', '#ddd6fe', '#d1fae5'
];

export default function RecordScreen() {
  const { addInspiration } = useInspiration();
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('learning');
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert('提示', '请输入灵感内容');
      return;
    }

    // Save the inspiration using context
    addInspiration({
      title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
      content: content,
      category: selectedCategory as 'learning' | 'research' | 'creation' | 'life',
      color: selectedColor,
    });

    Alert.alert('成功', '灵感已保存', [
      {
        text: '确定',
        onPress: () => {
          setContent('');
          setSelectedCategory('learning');
          setSelectedColor('#ffffff');
        }
      }
    ]);
  };

  const handleCancel = () => {
    if (content.trim()) {
      Alert.alert(
        '确认',
        '确定要取消吗？未保存的内容将丢失。',
        [
          { text: '继续编辑', style: 'cancel' },
          { 
            text: '确定取消', 
            style: 'destructive',
            onPress: () => {
              setContent('');
              setSelectedCategory('learning');
              setSelectedColor('#ffffff');
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>记录灵感</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择类别</Text>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                  { borderColor: category.color }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View 
                  style={[
                    styles.categoryDot, 
                    { backgroundColor: category.color }
                  ]} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择背景色</Text>
          <View style={styles.colorContainer}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionActive
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Text style={styles.colorCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>灵感内容</Text>
          <View style={[styles.inputContainer, { backgroundColor: selectedColor }]}>
            <TextInput
              style={styles.textInput}
              placeholder="在这里输入你的灵感..."
              placeholderTextColor={Colors.placeholder.light}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.foreground.light,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground.light,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary + '10',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.foreground.light,
  },
  categoryTextActive: {
    color: Colors.primary,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionActive: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  colorCheckmark: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minHeight: 200,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.foreground.light,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.subtle.light,
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});