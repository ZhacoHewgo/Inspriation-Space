const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Vercel build locally...\n');

try {
  // 清理之前的构建
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  // 运行构建
  console.log('🔨 Running vercel-build...');
  execSync('npm run vercel-build', { stdio: 'inherit' });
  
  // 检查构建结果
  console.log('\n📋 Checking build results...');
  
  const requiredFiles = [
    'dist/index.html',
    'dist/ads.txt',
    'dist/robots.txt',
    'dist/sitemap.xml'
  ];
  
  let allGood = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      allGood = false;
    }
  });
  
  // 检查 HTML 内容
  const htmlPath = 'dist/index.html';
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    if (htmlContent.includes('pub-7866441487993871')) {
      console.log('✅ AdSense code found in HTML');
    } else {
      console.log('❌ AdSense code missing from HTML');
      allGood = false;
    }
    
    if (htmlContent.includes('google-adsense-account')) {
      console.log('✅ AdSense meta tag found');
    } else {
      console.log('❌ AdSense meta tag missing');
      allGood = false;
    }
  }
  
  // 检查 ads.txt 内容
  const adsPath = 'dist/ads.txt';
  if (fs.existsSync(adsPath)) {
    const adsContent = fs.readFileSync(adsPath, 'utf8');
    if (adsContent.includes('pub-7866441487993871')) {
      console.log('✅ ads.txt content correct');
    } else {
      console.log('❌ ads.txt content incorrect');
      allGood = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('🎉 Build test PASSED! Ready for Vercel deployment.');
    console.log('\nTo deploy:');
    console.log('1. vercel --prod');
    console.log('2. Or push to GitHub if using Git integration');
  } else {
    console.log('❌ Build test FAILED! Please fix the issues above.');
  }
  console.log('='.repeat(50));
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}