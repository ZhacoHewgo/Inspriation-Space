import { Platform } from 'react-native';

export class AdSenseManager {
  private static instance: AdSenseManager;
  private isInitialized = false;
  private readonly clientId = 'ca-pub-7866441487993871';

  static getInstance(): AdSenseManager {
    if (!AdSenseManager.instance) {
      AdSenseManager.instance = new AdSenseManager();
    }
    return AdSenseManager.instance;
  }

  // 初始化AdSense
  initialize(): void {
    if (Platform.OS !== 'web' || this.isInitialized) {
      return;
    }

    try {
      // 检查AdSense脚本是否已加载
      if (typeof window !== 'undefined' && !window.adsbygoogle) {
        this.loadAdSenseScript();
      }
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize AdSense:', error);
    }
  }

  // 动态加载AdSense脚本
  private loadAdSenseScript(): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.clientId}`;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('AdSense script loaded successfully');
      // 启用页面级广告
      this.enablePageLevelAds();
    };
    
    script.onerror = () => {
      console.warn('Failed to load AdSense script');
    };
    
    document.head.appendChild(script);
  }

  // 启用页面级广告
  private enablePageLevelAds(): void {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({
          google_ad_client: this.clientId,
          enable_page_level_ads: true
        });
      }
    } catch (error) {
      console.warn('Failed to enable page level ads:', error);
    }
  }

  // 刷新广告
  refreshAds(): void {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    try {
      if (window.adsbygoogle) {
        // 重新推送所有广告
        const ads = document.querySelectorAll('.adsbygoogle');
        ads.forEach(() => {
          window.adsbygoogle.push({});
        });
      }
    } catch (error) {
      console.warn('Failed to refresh ads:', error);
    }
  }

  // 检查AdSense是否可用
  isAvailable(): boolean {
    return Platform.OS === 'web' && 
           typeof window !== 'undefined' && 
           !!window.adsbygoogle;
  }

  // 获取广告配置
  getAdConfig(slot: string, format: string = 'auto') {
    return {
      'data-ad-client': this.clientId,
      'data-ad-slot': slot,
      'data-ad-format': format,
      'data-full-width-responsive': 'true'
    };
  }
}

// 导出单例实例
export const adsenseManager = AdSenseManager.getInstance();

// 广告位配置
export const AD_SLOTS = {
  BANNER_TOP: '1234567890',    // 顶部横幅广告
  BANNER_BOTTOM: '1234567891', // 底部横幅广告
  SIDEBAR: '1234567892',       // 侧边栏广告
  CONTENT: '1234567893',       // 内容中广告
  MODAL: '1234567894',         // 模态框广告
};

// 广告样式预设
export const AD_STYLES = {
  banner: {
    width: '100%',
    minHeight: '90px',
    marginVertical: 10,
  },
  square: {
    width: '300px',
    height: '250px',
    margin: '10px auto',
  },
  sidebar: {
    width: '160px',
    height: '600px',
    margin: '10px',
  },
  responsive: {
    width: '100%',
    minHeight: '50px',
    maxHeight: '200px',
  },
};