#!/bin/bash

echo "🚀 Starting deployment process..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# 运行预部署检查
echo "🔍 Running pre-deployment checks..."
node test-build.js

if [ $? -ne 0 ]; then
    echo "❌ Pre-deployment checks failed. Please fix the issues above."
    exit 1
fi

# 构建项目
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# 检查 dist 目录
echo "📁 Checking dist directory..."
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found. Build may have failed."
    exit 1
fi

echo "📋 Files in dist directory:"
ls -la dist/

# 部署到 Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🔗 Next steps:"
    echo "1. Visit your deployed site"
    echo "2. Check these URLs:"
    echo "   - https://your-domain.vercel.app/ads.txt"
    echo "   - https://your-domain.vercel.app/robots.txt"
    echo "   - https://your-domain.vercel.app/sitemap.xml"
    echo "3. Wait 24-48 hours for Google to re-crawl"
    echo "4. Retry AdSense verification"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi