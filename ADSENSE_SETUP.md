# Google AdSense 集成指南

## 🎯 已完成的集成

### ✅ 1. HTML模板配置
- **文件位置**: `web/index.html`
- **AdSense脚本**: 已添加到`<head>`标签中
- **客户端ID**: `ca-pub-7866441487993871`

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7866441487993871" crossorigin="anonymous"></script>
```

### ✅ 2. AdSense组件系统
- **AdSense组件**: `src/components/AdSense.tsx`
- **管理工具**: `src/utils/adsense.ts`
- **预设广告位**: BannerAd, SquareAd, SidebarAd

### ✅ 3. 应用集成
- **App.tsx**: 自动初始化AdSense
- **HomeScreen**: 添加了顶部和内容广告位
- **响应式设计**: 广告适配不同屏幕尺寸

## 📋 需要完成的步骤

### 1. 获取真实的广告位ID
当前使用的是示例ID，需要替换为真实的AdSense广告位ID：

```typescript
// 在 src/utils/adsense.ts 中更新
export const AD_SLOTS = {
  BANNER_TOP: '你的广告位ID1',
  BANNER_BOTTOM: '你的广告位ID2', 
  SIDEBAR: '你的广告位ID3',
  CONTENT: '你的广告位ID4',
  MODAL: '你的广告位ID5',
};
```

### 2. AdSense账户设置
1. 登录 [Google AdSense](https://www.google.com/adsense/)
2. 添加你的网站域名
3. 创建广告单元
4. 获取广告位ID并替换代码中的示例ID

### 3. 网站验证
- 确保网站已通过AdSense审核
- 添加ads.txt文件到网站根目录
- 确保网站内容符合AdSense政策

## 🚀 部署和构建

### Web版本构建
```bash
# 构建Web版本
npm run build

# 或使用Expo CLI
expo build:web
```

### 部署到服务器
1. 将构建后的文件上传到Web服务器
2. 确保HTML模板中的AdSense脚本正常加载
3. 验证广告是否正常显示

## 📱 广告位配置

### 当前广告位
1. **顶部横幅广告**: 主页顶部，欢迎消息下方
2. **内容广告**: 灵感列表中间（当灵感数量>3时显示）

### 可添加的广告位
```typescript
// 在其他页面添加广告
import { BannerAd, SquareAd } from '../components/AdSense';

// 横幅广告
<BannerAd style={{ marginVertical: 16 }} />

// 方形广告
<SquareAd style={{ marginVertical: 20 }} />
```

## 🎨 广告样式自定义

### 响应式广告
```typescript
const adStyle = {
  width: '100%',
  minHeight: responsiveStyles.isDesktopSize ? 120 : 90,
  marginVertical: 16,
  backgroundColor: colors.surface,
  borderRadius: 8,
};
```

### 主题适配
广告容器会自动适配应用主题：
- 浅色主题：浅灰色背景
- 深色主题：深色背景
- 边框颜色跟随主题色彩

## 🔧 高级配置

### 页面级广告
已启用自动页面级广告：
```javascript
(adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-7866441487993871",
    enable_page_level_ads: true
});
```

### 广告刷新
```typescript
import { adsenseManager } from '../utils/adsense';

// 手动刷新广告
adsenseManager.refreshAds();
```

### 广告可用性检查
```typescript
if (adsenseManager.isAvailable()) {
    // 显示广告
} else {
    // 显示替代内容
}
```

## 📊 性能优化

### 延迟加载
- AdSense脚本异步加载
- 不影响应用启动速度
- 仅在Web平台加载

### 错误处理
- 广告加载失败时的降级处理
- 控制台警告而非错误
- 不影响应用正常功能

## 🔍 测试清单

### 开发环境测试
- ✅ AdSense脚本正常加载
- ✅ 广告容器正确显示
- ✅ 响应式布局正常
- ✅ 主题切换时广告样式正确

### 生产环境测试
- [ ] 真实广告位ID配置
- [ ] 广告正常显示
- [ ] 点击统计正常
- [ ] 收入统计正常

## 📝 注意事项

1. **AdSense政策**: 确保应用内容符合Google AdSense政策
2. **广告密度**: 避免广告过多影响用户体验
3. **移动端**: 当前仅在Web端显示广告
4. **测试模式**: 开发时使用测试广告位，避免无效点击

## 🎯 下一步

1. 申请并获得AdSense账户批准
2. 获取真实的广告位ID
3. 在其他页面添加合适的广告位
4. 监控广告效果和用户体验
5. 根据数据优化广告位置和样式

现在你的Web应用已经完全集成了Google AdSense！