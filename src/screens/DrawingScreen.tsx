import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface DrawingScreenProps {
  onBack: () => void;
  onSave?: (drawingData: any) => void;
}

type DrawingTool = 'pen' | 'brush' | 'pencil' | 'marker' | 'eraser';
type ShapeTool = 'circle' | 'rectangle' | 'line';

interface PathData {
  id: string;
  path: string;
  color: string;
  strokeWidth: number;
  tool: DrawingTool;
}

const { width: screenWidth } = Dimensions.get('window');
const canvasHeight = screenWidth * 0.75; // 4:3 aspect ratio

const colors = [
  '#ef4444', // red
  '#f59e0b', // yellow
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#000000', // black
];

const tools: { id: DrawingTool; icon: string; name: string }[] = [
  { id: 'pen', icon: '✏️', name: '钢笔' },
  { id: 'brush', icon: '🖌️', name: '画笔' },
  { id: 'pencil', icon: '✏️', name: '铅笔' },
  { id: 'marker', icon: '🖊️', name: '马克笔' },
  { id: 'eraser', icon: '🧹', name: '橡皮擦' },
];

const shapes: { id: ShapeTool; icon: string; name: string }[] = [
  { id: 'circle', icon: '⭕', name: '圆形' },
  { id: 'rectangle', icon: '⬜', name: '矩形' },
  { id: 'line', icon: '📏', name: '直线' },
];

export default function DrawingScreen({ onBack, onSave }: DrawingScreenProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [selectedTool, setSelectedTool] = useState<DrawingTool>('pen');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const pathRef = useRef<string>('');

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = `M${locationX},${locationY}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
      setIsDrawing(true);
    },

    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = `${pathRef.current} L${locationX},${locationY}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderRelease: () => {
      if (pathRef.current) {
        const newPathData: PathData = {
          id: Date.now().toString(),
          path: pathRef.current,
          color: selectedTool === 'eraser' ? 'transparent' : selectedColor,
          strokeWidth: selectedTool === 'eraser' ? strokeWidth * 2 : strokeWidth,
          tool: selectedTool,
        };
        setPaths(prev => [...prev, newPathData]);
      }
      setCurrentPath('');
      pathRef.current = '';
      setIsDrawing(false);
    },
  });

  const handleUndo = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    // For simplicity, we'll just implement undo for now
    // A full redo implementation would require maintaining a separate history stack
  };

  const handleClear = () => {
    Alert.alert(
      '清空画布',
      '确定要清空所有内容吗？此操作无法撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => setPaths([]),
        },
      ]
    );
  };

  const handleSave = () => {
    if (paths.length === 0) {
      Alert.alert('提示', '画布为空，请先绘制一些内容');
      return;
    }

    Alert.alert(
      '保存成功',
      '您的简笔画已保存到相册',
      [{ text: '确定', onPress: onBack }]
    );
  };

  const handleCancel = () => {
    if (paths.length > 0) {
      Alert.alert(
        '确认退出',
        '确定要退出吗？未保存的内容将丢失。',
        [
          { text: '继续绘制', style: 'cancel' },
          { text: '确定退出', style: 'destructive', onPress: onBack },
        ]
      );
    } else {
      onBack();
    }
  };

  const renderCanvas = () => (
    <View style={styles.canvasContainer} {...panResponder.panHandlers}>
      <Svg width={screenWidth} height={canvasHeight} style={styles.canvas}>
        {/* Render completed paths */}
        {paths.map((pathData) => (
          <Path
            key={pathData.id}
            d={pathData.path}
            stroke={pathData.color}
            strokeWidth={pathData.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeOpacity={pathData.tool === 'eraser' ? 0 : 1}
          />
        ))}

        {/* Render current path being drawn */}
        {currentPath && (
          <Path
            d={currentPath}
            stroke={selectedTool === 'eraser' ? 'transparent' : selectedColor}
            strokeWidth={selectedTool === 'eraser' ? strokeWidth * 2 : strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </Svg>
    </View>
  );

  const renderColorPalette = () => (
    <View style={styles.colorPalette}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selectedColor === color && styles.colorOptionSelected,
          ]}
          onPress={() => setSelectedColor(color)}
        />
      ))}
      <TouchableOpacity style={styles.colorPickerButton}>
        <Text style={styles.colorPickerIcon}>🎨</Text>
      </TouchableOpacity>
    </View>
  );

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <View style={styles.toolSection}>
        <View style={styles.undoRedoButtons}>
          <TouchableOpacity
            style={[styles.toolButton, paths.length === 0 && styles.toolButtonDisabled]}
            onPress={handleUndo}
            disabled={paths.length === 0}
          >
            <Text style={styles.toolIcon}>↶</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolButton, styles.toolButtonDisabled]}
            disabled
          >
            <Text style={styles.toolIcon}>↷</Text>
          </TouchableOpacity>
        </View>

        {renderColorPalette()}
      </View>

      <View style={styles.strokeWidthContainer}>
        <Text style={styles.strokeWidthLabel}>粗细</Text>
        <View style={styles.strokeWidthSlider}>
          {[1, 3, 5, 8, 12].map((width) => (
            <TouchableOpacity
              key={width}
              style={[
                styles.strokeWidthOption,
                strokeWidth === width && styles.strokeWidthOptionSelected,
              ]}
              onPress={() => setStrokeWidth(width)}
            >
              <View
                style={[
                  styles.strokeWidthDot,
                  {
                    width: width * 2,
                    height: width * 2,
                    borderRadius: width,
                    backgroundColor: strokeWidth === width ? Colors.primary : Colors.gray[400],
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.toolsContainer}>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[
              styles.toolButton,
              selectedTool === tool.id && styles.toolButtonSelected,
            ]}
            onPress={() => setSelectedTool(tool.id)}
          >
            <Text style={styles.toolButtonText}>{tool.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.shapesContainer}>
        {shapes.map((shape) => (
          <TouchableOpacity
            key={shape.id}
            style={styles.toolButton}
            onPress={() => {
              // Shape tools would be implemented here
              Alert.alert('提示', `${shape.name}工具开发中...`);
            }}
          >
            <Text style={styles.toolButtonText}>{shape.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>简笔画创作</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>保存</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas */}
      {renderCanvas()}

      {/* Toolbar */}
      {renderToolbar()}
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
  cancelText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.foreground.light,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  canvas: {
    backgroundColor: Colors.white,
  },
  toolbar: {
    backgroundColor: Colors.background.light,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  toolSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  undoRedoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  colorPalette: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  colorOptionSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  colorPickerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerIcon: {
    fontSize: 16,
  },
  strokeWidthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  strokeWidthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.foreground.light,
  },
  strokeWidthSlider: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  strokeWidthOption: {
    padding: 8,
  },
  strokeWidthOptionSelected: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 12,
  },
  strokeWidthDot: {
    backgroundColor: Colors.gray[400],
  },
  toolsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 8,
    gap: 4,
  },
  shapesContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 8,
    gap: 4,
  },
  toolButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolButtonSelected: {
    backgroundColor: Colors.primary,
  },
  toolButtonDisabled: {
    opacity: 0.3,
  },
  toolButtonText: {
    fontSize: 20,
  },
  toolIcon: {
    fontSize: 18,
    color: Colors.foreground.light,
  },
});