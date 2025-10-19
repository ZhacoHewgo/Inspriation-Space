module.exports = {
  extends: [
    'expo',
    '@react-native-community',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // 自定义规则
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-native/no-inline-styles': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.expo/',
    'inspiration-space/',
    'inspiration-space-fixed/',
  ],
};