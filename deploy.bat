@echo off
echo 🚀 Starting deployment process...

REM 检查是否安装了 Vercel CLI
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM 运行预部署检查
echo 🔍 Running pre-deployment checks...
node test-build.js
if %errorlevel% neq 0 (
    echo ❌ Pre-deployment checks failed. Please fix the issues above.
    pause
    exit /b 1
)

REM 构建项目
echo 🔨 Building project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

REM 检查 dist 目录
echo 📁 Checking dist directory...
if not exist "dist" (
    echo ❌ dist directory not found. Build may have failed.
    pause
    exit /b 1
)

echo 📋 Files in dist directory:
dir dist

REM 部署到 Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

if %errorlevel% equ 0 (
    echo ✅ Deployment successful!
    echo.
    echo 🔗 Next steps:
    echo 1. Visit your deployed site
    echo 2. Check these URLs:
    echo    - https://your-domain.vercel.app/ads.txt
    echo    - https://your-domain.vercel.app/robots.txt
    echo    - https://your-domain.vercel.app/sitemap.xml
    echo 3. Wait 24-48 hours for Google to re-crawl
    echo 4. Retry AdSense verification
) else (
    echo ❌ Deployment failed. Please check the errors above.
)

pause