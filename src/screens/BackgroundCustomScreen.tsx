import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useBackground } from '../context/BackgroundContext';

interface BackgroundCustomScreenProps {
  onBack: () => void;
  category?: string;
}

const presetBackgrounds = [
  {
    id: '1',
    name: '学习空间',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    category: 'learning',
  },
  {
    id: '2',
    name: '研究实验室',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: 'research',
  },
  {
    id: '3',
    name: '创作工作室',
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    category: 'creation',
  },
  {
    id: '4',
    name: '生活场景',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    category: 'life',
  },
  {
    id: '5',
    name: '自然风光',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    category: 'nature',
  },
  {
    id: '6',
    name: '城市夜景',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=400&fit=crop',
    category: 'urban',
  },
  {
    id: '7',
    name: '抽象艺术',
    url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    category: 'abstract',
  },
  {
    id: '8',
    name: '简约风格',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    category: 'minimal',
  },
  // 模拟用户上传的照片
  {
    id: 'camera_photo',
    name: '相机拍摄',
    url: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=400&fit=crop',
    category: 'user_photo',
  },
  {
    id: 'gallery_photo',
    name: '相册照片',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    category: 'user_photo',
  },
  {
    id: 'drawing_creation',
    name: '简笔画作品',
    url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    category: 'user_drawing',
  },
];

export default function BackgroundCustomScreen({ onBack, category }: BackgroundCustomScreenProps) {
  const { colors } = useTheme();
  const { updateCategoryBackground } = useBackground();
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'learning');
  const [showPreview, setShowPreview] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const categoryLabels = {
    learning: '学习',
    research: '科研',
    creation: '创作',
    life: '生活',
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      '上传照片',
      '选择照片来源',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '相机拍摄', 
          onPress: () => {
            // 模拟相机功能
            Alert.alert('相机功能', '在真实设备上，这里会打开相机让您拍摄照片。\n\n当前为演示模式，已为您选择了一张示例照片。', [
              { text: '确定', onPress: () => {
                setSelectedBackground('camera_photo');
                setShowPreview(true);
              }}
            ]);
          }
        },
        { 
          text: '相册选择', 
          onPress: () => {
            // 模拟相册功能
            Alert.alert('相册功能', '在真实设备上，这里会打开相册让您选择照片。\n\n当前为演示模式，已为您选择了一张示例照片。', [
              { text: '确定', onPress: () => {
                setSelectedBackground('gallery_photo');
                setShowPreview(true);
              }}
            ]);
          }
        },
      ]
    );
  };

  const handleDrawingCreation = () => {
    Alert.alert('简笔画创作', '即将跳转到简笔画创作页面', [
      { text: '取消', style: 'cancel' },
      { 
        text: '开始创作', 
        onPress: () => {
          // 模拟简笔画创作完成
          Alert.alert('创作完成', '您的简笔画作品已保存！\n\n当前为演示模式，已为您生成了一个示例作品。', [
            { text: '确定', onPress: () => {
              setSelectedBackground('drawing_creation');
              setShowPreview(true);
            }}
          ]);
        }
      },
    ]);
  };

  const handleSelectPreset = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    setShowPreview(true);
  };

  const handleApplyBackground = () => {
    if (selectedBackground) {
      const background = presetBackgrounds.find(bg => bg.id === selectedBackground);
      if (background) {
        updateCategoryBackground(selectedCategory, background.url);
        const categoryName = categoryLabels[selectedCategory as keyof typeof categoryLabels];
        Alert.alert('成功', `背景已应用到"${categoryName}"类别`, [
          { text: '确定', onPress: onBack }
        ]);
      }
    }
  };

  const renderPreviewModal = () => {
    const background = presetBackgrounds.find(bg => bg.id === selectedBackground);
    if (!background) return null;

    const getPreviewTitle = () => {
      switch (background.category) {
        case 'user_photo':
          return '我的照片';
        case 'user_drawing':
          return '我的创作';
        default:
          return '示例类别';
      }
    };

    return (
      <Modal
        visible={showPreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.previewModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>背景预览</Text>
            
            <View style={styles.previewContainer}>
              <ImageBackground
                source={{ uri: background.url }}
                style={styles.previewCard}
                imageStyle={styles.previewCardImage}
              >
                <View style={styles.previewOverlay} />
                <View style={styles.previewContent}>
                  <Text style={styles.previewTitle}>{getPreviewTitle()}</Text>
                  <Text style={styles.previewCount}>12个灵感</Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalCancelButton, { borderColor: colors.border }]}
                onPress={() => setShowPreview(false)}
              >
                <Text style={[styles.modalCancelButtonText, { color: colors.textSecondary }]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveButton, { backgroundColor: colors.primary }]}
                onPress={handleApplyBackground}
              >
                <Text style={styles.modalSaveButtonText}>应用背景</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCategoryModal = () => (
    <Modal
      visible={showCategoryModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.categoryModal, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>选择类别</Text>
          
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryModalOption,
                { borderBottomColor: colors.border },
                selectedCategory === key && { backgroundColor: colors.primary + '10' }
              ]}
              onPress={() => {
                setSelectedCategory(key);
                setShowCategoryModal(false);
              }}
            >
              <Text style={[
                styles.categoryModalOptionText,
                { color: selectedCategory === key ? colors.primary : colors.text }
              ]}>
                {label}
              </Text>
              {selectedCategory === key && (
                <Text style={[styles.categoryModalCheck, { color: colors.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.categoryModalCancel, { borderTopColor: colors.border }]}
            onPress={() => setShowCategoryModal(false)}
          >
            <Text style={[styles.categoryModalCancelText, { color: colors.textSecondary }]}>取消</Text>
          </TouchableOpacity>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>背景自定义</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Category Selection */}
        <View style={styles.categorySelectionSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>选择类别</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            选择要自定义背景的类别
          </Text>
          
          <TouchableOpacity
            style={[styles.categorySelector, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={[styles.categorySelectorText, { color: colors.text }]}>
              {categoryLabels[selectedCategory as keyof typeof categoryLabels]}
            </Text>
            <Text style={[styles.categorySelectorArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleUploadPhoto}
          >
            <Text style={styles.actionIcon}>📁</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>上传照片</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>从相册选择或拍摄新照片</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleDrawingCreation}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>简笔画创作</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>使用内置工具创作背景</Text>
          </TouchableOpacity>
        </View>

        {/* Preset Backgrounds */}
        <View style={styles.presetSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>预设背景</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            选择精美的预设背景图片
          </Text>

          <View style={styles.presetGrid}>
            {presetBackgrounds.map((background) => (
              <TouchableOpacity
                key={background.id}
                style={[
                  styles.presetItem,
                  selectedBackground === background.id && styles.presetItemSelected,
                  { borderColor: selectedBackground === background.id ? colors.primary : colors.border }
                ]}
                onPress={() => handleSelectPreset(background.id)}
              >
                <ImageBackground
                  source={{ uri: background.url }}
                  style={styles.presetImage}
                  imageStyle={styles.presetImageStyle}
                >
                  <View style={styles.presetOverlay} />
                  <Text style={styles.presetName}>{background.name}</Text>
                  {selectedBackground === background.id && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIcon}>✓</Text>
                    </View>
                  )}
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={[styles.tipsSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 使用提示</Text>
          <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
            • 选择与类别主题相关的背景图片{'\n'}
            • 建议使用色彩柔和的图片以确保文字清晰{'\n'}
            • 可以为不同类别设置不同的背景{'\n'}
            • 自定义背景会自动保存到本地
          </Text>
        </View>
      </ScrollView>

      {renderPreviewModal()}
      {renderCategoryModal()}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categorySelectionSection: {
    paddingVertical: 24,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  categorySelectorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categorySelectorArrow: {
    fontSize: 18,
  },
  actionSection: {
    paddingVertical: 24,
    gap: 16,
  },
  actionButton: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  presetSection: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetItem: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
  },
  presetItemSelected: {
    borderWidth: 3,
  },
  presetImage: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  presetImageStyle: {
    borderRadius: 10,
  },
  presetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  presetName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 12,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#13a4ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipsSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipsText: {
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
  previewModal: {
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
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewCard: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  previewCardImage: {
    borderRadius: 12,
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  previewContent: {
    padding: 16,
  },
  previewTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  previewCount: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
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
  categoryModal: {
    borderRadius: 12,
    padding: 0,
    width: '100%',
    maxWidth: 300,
    overflow: 'hidden',
  },
  categoryModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  categoryModalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryModalCheck: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryModalCancel: {
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  categoryModalCancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});