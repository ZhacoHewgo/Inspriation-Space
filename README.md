# 灵感空间 (Inspiration Space)

一款专为大学生设计的灵感记录和管理移动应用。

## 功能特性

### 已实现功能

1. **新手引导页** - 3页轮播介绍应用功能
2. **用户认证系统**
   - 登录页面
   - 注册页面（包含手机验证码）
   - 忘记密码页面
3. **主要功能页面**
   - 灵感空间主页（支持模块视图和日历视图切换）
   - 记录灵感页面（支持分类和颜色选择）
   - 设置页面（完整的设置选项）

### 核心功能

- **分类管理**: 支持学习、科研、创作、生活四大类别
- **视图切换**: 模块分类视图和日历视图
- **搜索功能**: 快速查找灵感内容
- **筛选排序**: 按类别、时间等维度筛选
- **个性化**: 支持自定义卡片颜色和背景

## 技术栈

- **框架**: React Native + Expo
- **导航**: React Navigation 6
- **语言**: TypeScript
- **UI**: 自定义组件 + 原生样式

## 项目结构

```
src/
├── constants/          # 常量定义
│   └── colors.ts      # 颜色主题
├── navigation/         # 导航配置
│   └── AppNavigator.tsx
├── screens/           # 页面组件
│   ├── OnboardingScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   ├── HomeScreen.tsx
│   ├── RecordScreen.tsx
│   └── SettingsScreen.tsx
└── types/             # 类型定义
    └── index.ts
```

## 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 在iOS模拟器中运行
npm run ios

# 在Android模拟器中运行
npm run android
```

## 设计参考

项目UI设计参考了 `mocks/` 文件夹中的设计稿，确保界面简洁美观，符合大学生用户的使用习惯。

## 开发状态

✅ 基础框架搭建完成
✅ 用户认证流程完成
✅ 主要页面UI完成
🔄 数据持久化开发中
🔄 高级功能开发中

## 下一步计划

1. 实现数据持久化（AsyncStorage/SQLite）
2. 添加灵感卡片的CRUD操作
3. 实现搜索和筛选功能
4. 添加数据统计页面
5. 实现背景自定义功能
6. 添加批量操作功能# Inspriation-Space
