# 灵感空间应用商店上架指南

## 📱 应用商店上架准备

### 🍎 App Store (iOS) 上架指南

#### 1. 开发者账号准备
- **Apple Developer Program**: 需要注册Apple开发者账号 ($99/年)
- **开发者证书**: 配置开发和发布证书
- **App ID**: 创建唯一的Bundle Identifier

#### 2. 应用配置
```json
// app.json 配置示例
{
  "expo": {
    "name": "灵感空间",
    "slug": "inspiration-space",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#13a4ec"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.inspirationspace",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "用于拍摄照片作为灵感背景",
        "NSPhotoLibraryUsageDescription": "用于选择照片作为灵感背景"
      }
    }
  }
}
```

#### 3. 构建和提交
```bash
# 安装EAS CLI
npm install -g @expo/eas-cli

# 登录Expo账号
eas login

# 配置构建
eas build:configure

# 构建iOS应用
eas build --platform ios

# 提交到App Store
eas submit --platform ios
```

#### 4. App Store Connect 配置
- **应用信息**: 填写应用名称、描述、关键词
- **定价和可用性**: 设置为免费应用
- **应用审核信息**: 提供测试账号和说明
- **版本信息**: 上传截图、应用预览视频

### 🤖 Google Play Store (Android) 上架指南

#### 1. 开发者账号准备
- **Google Play Console**: 注册开发者账号 ($25一次性费用)
- **签名密钥**: 配置应用签名

#### 2. 应用配置
```json
// app.json Android配置
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#13a4ec"
      },
      "package": "com.yourcompany.inspirationspace",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

#### 3. 构建和提交
```bash
# 构建Android应用
eas build --platform android

# 提交到Google Play
eas submit --platform android
```

#### 4. Google Play Console 配置
- **应用详情**: 填写应用信息和描述
- **商品详情**: 上传图标、截图、功能图片
- **内容分级**: 完成内容分级问卷
- **目标受众**: 设置目标年龄组

## 🎨 应用资源准备

### 必需的图标和截图

#### iOS 资源
- **应用图标**: 1024x1024px (App Store)
- **启动屏幕**: 1242x2688px, 828x1792px等
- **截图**: 
  - iPhone: 1290x2796px (6.7寸), 1179x2556px (6.1寸)
  - iPad: 2048x2732px (12.9寸), 1668x2388px (11寸)

#### Android 资源
- **应用图标**: 512x512px (Google Play)
- **自适应图标**: 108x108dp前景 + 背景
- **截图**: 
  - 手机: 1080x1920px 至 3840x2160px
  - 平板: 1200x1920px 至 3840x2160px
- **功能图片**: 1024x500px

### 应用描述模板

#### 中文描述
```
灵感空间 - 专为大学生设计的灵感记录应用

🎯 核心功能
• 快速记录灵感，支持学习、科研、创作、生活四大分类
• 智能搜索和筛选，快速找到所需灵感
• 数据统计分析，了解你的创意趋势
• 简笔画创作工具，让灵感更生动

🎨 个性化体验
• 自定义卡片颜色和背景
• 深色模式支持
• 直观的日历和模块视图

📊 数据洞察
• 详细的记录统计
• 类别分布分析
• 创作趋势图表

适合学生、创作者、研究者使用，让每一个灵感都得到妥善记录和管理。
```

#### 英文描述
```
Inspiration Space - The Ultimate Idea Management App for Students

🎯 Core Features
• Quick idea recording with 4 categories: Learning, Research, Creation, Life
• Smart search and filtering to find ideas instantly
• Data analytics to track your creative trends
• Built-in drawing tools for visual inspiration

🎨 Personalized Experience
• Customizable card colors and backgrounds
• Dark mode support
• Intuitive calendar and module views

📊 Data Insights
• Detailed recording statistics
• Category distribution analysis
• Creative trend charts

Perfect for students, creators, and researchers to capture and manage every precious idea.
```

## 🔍 应用审核准备

### App Store 审核要点
1. **功能完整性**: 确保所有功能正常工作
2. **用户界面**: 遵循iOS设计规范
3. **隐私政策**: 如果收集用户数据需要隐私政策
4. **内容适宜性**: 确保内容适合所有年龄段
5. **性能优化**: 应用启动快速，运行流畅

### Google Play 审核要点
1. **目标API级别**: 确保使用最新的Android API
2. **权限使用**: 合理使用权限并提供说明
3. **内容政策**: 遵循Google Play内容政策
4. **技术要求**: 应用稳定性和性能
5. **元数据质量**: 准确的应用描述和截图

## 🚀 发布流程

### 发布前检查清单
- [ ] 应用功能完整测试
- [ ] 多设备兼容性测试
- [ ] 性能和内存使用优化
- [ ] 图标和截图准备完成
- [ ] 应用描述和关键词优化
- [ ] 隐私政策和服务条款
- [ ] 开发者账号和证书配置

### 发布步骤
1. **构建发布版本**
   ```bash
   # 构建生产版本
   eas build --platform all --profile production
   ```

2. **测试发布版本**
   - 在真实设备上测试
   - 检查所有功能是否正常
   - 验证性能表现

3. **提交审核**
   ```bash
   # 提交到应用商店
   eas submit --platform all
   ```

4. **监控审核状态**
   - 关注审核进度
   - 及时回应审核反馈
   - 准备更新版本

## 📈 上架后运营

### 应用商店优化 (ASO)
- **关键词优化**: 研究用户搜索习惯
- **截图优化**: 突出核心功能
- **用户评价**: 鼓励用户留下好评
- **定期更新**: 持续改进和新功能

### 用户反馈处理
- **及时回复**: 回应用户评论和反馈
- **问题修复**: 快速修复用户报告的问题
- **功能改进**: 根据用户需求优化功能

## 💡 成功上架的关键因素

1. **应用质量**: 确保应用稳定、流畅、功能完整
2. **用户体验**: 直观的界面设计和流畅的操作体验
3. **市场定位**: 明确的目标用户和价值主张
4. **合规性**: 遵循平台政策和法律法规
5. **持续维护**: 定期更新和功能改进

## 📞 技术支持

如果在上架过程中遇到问题，可以参考：
- [Expo官方文档](https://docs.expo.dev/)
- [Apple开发者文档](https://developer.apple.com/)
- [Google Play开发者文档](https://developer.android.com/)

祝您的应用成功上架！🎉