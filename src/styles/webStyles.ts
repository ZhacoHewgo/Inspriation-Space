import { StyleSheet, Platform } from 'react-native';
import { getResponsiveStyles } from '../utils/responsive';

export const createWebStyles = () => {
  const { isDesktopSize, isTabletSize, containerPadding } = getResponsiveStyles();
  
  if (Platform.OS !== 'web') {
    return StyleSheet.create({});
  }

  return StyleSheet.create({
    // 主容器样式
    webContainer: {
      maxWidth: isDesktopSize ? 1200 : '100%',
      marginHorizontal: 'auto',
      paddingHorizontal: containerPadding,
    },
    
    // 网格布局
    webGrid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: isDesktopSize ? 20 : isTabletSize ? 16 : 12,
      justifyContent: isDesktopSize ? 'flex-start' : 'space-between',
    },
    
    // 卡片样式
    webCard: {
      minWidth: isDesktopSize ? 280 : 200,
    },
    
    // 模态框样式
    webModal: {
      maxWidth: isDesktopSize ? 600 : isTabletSize ? 500 : 400,
      maxHeight: isDesktopSize ? 600 : 500,
    },
    
    // 头部样式
    webHeader: {
      paddingHorizontal: containerPadding,
      paddingVertical: isDesktopSize ? 24 : 16,
    },
    
    // 内容区域
    webContent: {
      paddingHorizontal: containerPadding,
      paddingBottom: isDesktopSize ? 40 : 20,
    },
    
    // 响应式文字
    webTitle: {
      fontSize: isDesktopSize ? 32 : isTabletSize ? 28 : 24,
    },
    
    webSubtitle: {
      fontSize: isDesktopSize ? 18 : isTabletSize ? 16 : 14,
    },
    
    // 按钮样式
    webButton: {
      minHeight: isDesktopSize ? 48 : 44,
      paddingHorizontal: isDesktopSize ? 24 : 20,
    },
    
    // 输入框样式
    webInput: {
      minHeight: isDesktopSize ? 48 : 44,
      fontSize: isDesktopSize ? 16 : 14,
    },
  });
};

// 媒体查询样式
export const webMediaQueries = {
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
};