import React, { useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: any;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  style = {},
  className = ''
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        // 确保AdSense脚本已加载
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (error) {
        console.warn('AdSense error:', error);
      }
    }
  }, []);

  // 只在Web平台显示广告
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={style}>
      <div
        ref={adRef}
        className={`adsbygoogle ${className}`}
        style={{
          display: 'block',
          textAlign: 'center',
          minHeight: '100px',
          ...style
        }}
        data-ad-client="ca-pub-7866441487993871"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </View>
  );
}

// 预定义的广告位组件
export const BannerAd = ({ style }: { style?: any }) => (
  <AdSense
    adSlot="1234567890" // 替换为实际的广告位ID
    adFormat="horizontal"
    style={style}
    className="banner-ad"
  />
);

export const SquareAd = ({ style }: { style?: any }) => (
  <AdSense
    adSlot="1234567891" // 替换为实际的广告位ID
    adFormat="rectangle"
    style={style}
    className="square-ad"
  />
);

export const SidebarAd = ({ style }: { style?: any }) => (
  <AdSense
    adSlot="1234567892" // 替换为实际的广告位ID
    adFormat="vertical"
    style={style}
    className="sidebar-ad"
  />
);