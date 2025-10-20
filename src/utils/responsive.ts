import { Dimensions, Platform } from 'react-native';

export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

export const isWeb = Platform.OS === 'web';
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

export const getResponsiveStyles = () => {
  const { width } = getScreenDimensions();
  
  // 定义断点
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  };
  
  const isMobileSize = width < breakpoints.mobile;
  const isTabletSize = width >= breakpoints.mobile && width < breakpoints.tablet;
  const isDesktopSize = width >= breakpoints.tablet;
  
  // 计算卡片宽度（数值形式）
  const getCardWidth = () => {
    const gap = 16;
    const padding = isDesktopSize ? 40 : isMobileSize ? 16 : 24;
    const availableWidth = width - (padding * 2);
    
    if (isDesktopSize) {
      return (availableWidth - gap * 3) / 4; // 4列
    } else if (isTabletSize) {
      return (availableWidth - gap * 2) / 3; // 3列
    } else {
      return (availableWidth - gap) / 2; // 2列
    }
  };
  
  return {
    isMobileSize,
    isTabletSize,
    isDesktopSize,
    containerWidth: isDesktopSize ? Math.min(1200, width * 0.8) : width,
    containerPadding: isDesktopSize ? 40 : isMobileSize ? 16 : 24,
    gridColumns: isDesktopSize ? 4 : isTabletSize ? 3 : 2,
    cardWidth: getCardWidth(),
  };
};

export const getWebStyles = () => {
  if (!isWeb) return {};
  
  const { isDesktopSize, containerWidth, containerPadding } = getResponsiveStyles();
  
  return {
    container: {
      maxWidth: containerWidth,
      marginHorizontal: 'auto' as const,
      paddingHorizontal: containerPadding,
    },
    webOnly: {
      display: isWeb ? 'flex' : 'none',
    },
    mobileOnly: {
      display: isWeb ? 'none' : 'flex',
    },
  };
};