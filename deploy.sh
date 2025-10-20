#!/bin/bash

echo "🚀 Starting deployment process..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# 运行构建测试
echo "🧪 Testing build process..."
node test-vercel-build.js

if [ $? -ne 0 ]; then
    echo "❌ Build test failed. Please fix the issues above."
    exit 1
fi

echo "✅ Build test passed!"

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
    echo "3. Verify AdSense code in page source"
    echo "4. Wait 24-48 hours for Google to re-crawl"
    echo "5. Retry AdSense verification"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi