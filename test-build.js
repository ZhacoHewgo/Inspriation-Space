const fs = require('fs');
const path = require('path');

console.log('🔍 Testing build configuration...\n');

// 检查必要文件是否存在
const requiredFiles = [
  'web/ads.txt',
  'web/robots.txt',
  'web/sitemap.xml', 
  'web/privacy-policy.html',
  'web/terms-of-service.html',
  'web/manifest.json',
  'web/index.html'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// 检查ads.txt内容
const adsPath = path.join(__dirname, 'web/ads.txt');
if (fs.existsSync(adsPath)) {
  const adsContent = fs.readFileSync(adsPath, 'utf8').trim();
  if (adsContent.includes('pub-7866441487993871')) {
    console.log('✅ ads.txt contains correct publisher ID');
  } else {
    console.log('❌ ads.txt missing publisher ID');
    allFilesExist = false;
  }
}

// 检查dist/index.html中的AdSense代码
const distIndexPath = path.join(__dirname, 'dist/index.html');
if (fs.existsSync(distIndexPath)) {
  const htmlContent = fs.readFileSync(distIndexPath, 'utf8');
  if (htmlContent.includes('pub-7866441487993871')) {
    console.log('✅ dist/index.html contains AdSense code');
  } else {
    console.log('❌ dist/index.html missing AdSense code');
    allFilesExist = false;
  }
  
  if (htmlContent.includes('google-adsense-account')) {
    console.log('✅ dist/index.html contains AdSense meta tag');
  } else {
    console.log('❌ dist/index.html missing AdSense meta tag');
    allFilesExist = false;
  }
} else {
  console.log('⚠️  dist/index.html not found (run build first)');
}

// 检查package.json构建脚本
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
if (packageJson.scripts['vercel-build']) {
  console.log('✅ vercel-build script configured');
} else {
  console.log('❌ vercel-build script missing');
  allFilesExist = false;
}

// 检查vercel.json
const vercelPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  console.log('✅ vercel.json exists');
} else {
  console.log('❌ vercel.json missing');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 All files ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run build');
  console.log('2. Deploy to Vercel: vercel --prod');
  console.log('3. Check these URLs after deployment:');
  console.log('   - https://your-domain.com/ads.txt');
  console.log('   - https://your-domain.com/robots.txt');
  console.log('   - https://your-domain.com/sitemap.xml');
} else {
  console.log('❌ Some files are missing. Please check the errors above.');
}
console.log('='.repeat(50));