const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Web specific configurations
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Add support for web-specific file extensions
config.resolver.sourceExts.push('web.js', 'web.ts', 'web.tsx');

// Configure web build
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// AdSense and analytics support
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

module.exports = config;