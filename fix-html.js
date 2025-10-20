const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing HTML file for AdSense...');

const distIndexPath = path.join(__dirname, 'dist', 'index.html');
const webIndexPath = path.join(__dirname, 'web', 'index.html');

if (!fs.existsSync(distIndexPath)) {
  console.error('❌ dist/index.html not found. Please run build first.');
  process.exit(1);
}

if (!fs.existsSync(webIndexPath)) {
  console.error('❌ web/index.html not found.');
  process.exit(1);
}

// 读取原始文件
let distHtml = fs.readFileSync(distIndexPath, 'utf8');
const webHtml = fs.readFileSync(webIndexPath, 'utf8');

// 提取AdSense代码和meta标签
const adsenseScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7866441487993871" crossorigin="anonymous"></script>`;
const adsenseMeta = `<meta name="google-adsense-account" content="ca-pub-7866441487993871">`;
const robotsMeta = `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow" />`;

// 提取SEO meta标签
const seoMetas = `<meta name="description" content="灵感空间是一款专为大学生设计的灵感记录应用，帮助你捕捉、整理和管理学习、科研、创作和生活中的每一个宝贵灵感。" />
    <meta name="keywords" content="灵感记录,大学生,学习工具,创意管理,笔记应用" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://inspiration-space.vercel.app/" />
    <meta property="og:title" content="灵感空间 - 记录你的每一个灵感" />
    <meta property="og:description" content="专为大学生设计的灵感记录应用，帮助你捕捉、整理和管理学习、科研、创作和生活中的每一个宝贵灵感。" />
    <meta property="og:image" content="https://inspiration-space.vercel.app/og-image.png" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://inspiration-space.vercel.app/" />
    <meta property="twitter:title" content="灵感空间 - 记录你的每一个灵感" />
    <meta property="twitter:description" content="专为大学生设计的灵感记录应用，帮助你捕捉、整理和管理学习、科研、创作和生活中的每一个宝贵灵感。" />
    <meta property="twitter:image" content="https://inspiration-space.vercel.app/og-image.png" />`;

// 在head标签中添加AdSense和SEO内容
distHtml = distHtml.replace(
  '<meta charset="utf-8" />',
  `<meta charset="utf-8" />
    
    <!-- Google AdSense - 必须在head标签的最前面 -->
    ${adsenseScript}
    
    <!-- Google AdSense 验证标签 -->
    ${adsenseMeta}
    
    <!-- 网站验证 -->
    ${robotsMeta}
    
    <!-- SEO Meta Tags -->
    ${seoMetas}`
);

// 更新title
distHtml = distHtml.replace(
  '<title>灵感空间</title>',
  '<title>灵感空间 - 记录你的每一个灵感</title>'
);

// 更新lang属性
distHtml = distHtml.replace(
  '<html lang="en">',
  '<html lang="zh-CN">'
);

// 在body中添加noscript内容
const noscriptContent = `<noscript>
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1>灵感空间 - 记录你的每一个灵感</h1>
            <p>灵感空间是一款专为大学生设计的灵感记录应用，帮助你捕捉、整理和管理学习、科研、创作和生活中的每一个宝贵灵感。</p>
            <p>请启用JavaScript以获得最佳体验。</p>
        </div>
    </noscript>`;

distHtml = distHtml.replace(
  '<noscript>\n      You need to enable JavaScript to run this app.\n    </noscript>',
  noscriptContent
);

// 在body结束前添加AdSense自动广告脚本
const autoAdsScript = `
    <!-- AdSense Auto Ads -->
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-7866441487993871",
            enable_page_level_ads: true
        });
    </script>`;

distHtml = distHtml.replace('</body>', `${autoAdsScript}\n</body>`);

// 写回文件
fs.writeFileSync(distIndexPath, distHtml, 'utf8');

console.log('✅ HTML file updated successfully!');
console.log('📋 Added:');
console.log('  - AdSense script and meta tags');
console.log('  - SEO meta tags');
console.log('  - Robots meta tags');
console.log('  - Structured noscript content');
console.log('  - Auto ads script');

// 验证修改
if (distHtml.includes('pub-7866441487993871')) {
  console.log('✅ AdSense code verified in HTML');
} else {
  console.log('❌ AdSense code not found in HTML');
}

if (distHtml.includes('google-adsense-account')) {
  console.log('✅ AdSense meta tag verified');
} else {
  console.log('❌ AdSense meta tag not found');
}