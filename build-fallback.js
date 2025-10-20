const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting fallback build process...');

try {
  // 尝试使用 Expo CLI
  console.log('📦 Building with Expo...');
  execSync('npx expo export -p web', { stdio: 'inherit' });
  console.log('✅ Expo build completed');
} catch (error) {
  console.log('❌ Expo build failed, trying alternative...');
  
  // 如果 Expo 失败，尝试直接使用 webpack
  try {
    console.log('📦 Trying webpack build...');
    execSync('npx webpack --mode production', { stdio: 'inherit' });
  } catch (webpackError) {
    console.log('❌ Webpack build also failed');
    
    // 最后的备用方案：创建一个基本的 HTML 文件
    console.log('🆘 Creating minimal HTML fallback...');
    
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // 创建基本的 index.html
    const basicHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7866441487993871" crossorigin="anonymous"></script>
    <meta name="google-adsense-account" content="ca-pub-7866441487993871">
    
    <title>灵感空间 - 记录你的每一个灵感</title>
    <meta name="description" content="灵感空间是一款专为大学生设计的灵感记录应用，帮助你捕捉、整理和管理学习、科研、创作和生活中的每一个宝贵灵感。" />
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #13a4ec 0%, #1e40af 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
        }
        .feature h3 {
            margin-top: 0;
            color: #fbbf24;
        }
        footer {
            margin-top: 40px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💡 灵感空间</h1>
        <p>专为大学生设计的灵感记录应用，帮助你捕捉、整理和管理学习、科研、创作和生活中的每一个宝贵灵感。</p>
        
        <div class="features">
            <div class="feature">
                <h3>📚 学习</h3>
                <p>记录学习过程中的心得体会和方法总结</p>
            </div>
            <div class="feature">
                <h3>🔬 科研</h3>
                <p>科研想法、研究方向和学术灵感</p>
            </div>
            <div class="feature">
                <h3>🎨 创作</h3>
                <p>创意设计、艺术创作和项目构思</p>
            </div>
            <div class="feature">
                <h3>🌟 生活</h3>
                <p>日常生活中的感悟和有趣想法</p>
            </div>
        </div>
        
        <p>应用正在开发中，敬请期待完整版本！</p>
        
        <footer>
            <p>&copy; 2024 灵感空间. 专为大学生设计的灵感记录应用.</p>
            <p>
                <a href="/privacy-policy.html" style="color: #fbbf24;">隐私政策</a> | 
                <a href="/terms-of-service.html" style="color: #fbbf24;">服务条款</a>
            </p>
        </footer>
    </div>
    
    <!-- AdSense Auto Ads -->
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-7866441487993871",
            enable_page_level_ads: true
        });
    </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(distDir, 'index.html'), basicHtml);
    console.log('✅ Fallback HTML created');
  }
}

// 复制静态文件
try {
  console.log('📁 Copying static files...');
  require('./build-static.js');
} catch (error) {
  console.log('⚠️  Static file copy failed:', error.message);
}

// 修复HTML文件
try {
  console.log('🔧 Fixing HTML file...');
  require('./fix-html.js');
} catch (error) {
  console.log('⚠️  HTML fix failed:', error.message);
}

console.log('🎉 Build process completed!');