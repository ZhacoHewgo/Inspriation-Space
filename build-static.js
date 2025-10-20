const fs = require('fs');
const path = require('path');

// 确保dist目录存在
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 需要复制的文件
const filesToCopy = [
  'ads.txt',
  'robots.txt', 
  'sitemap.xml',
  'privacy-policy.html',
  'terms-of-service.html',
  'manifest.json'
];

// 复制文件从web目录到dist目录
filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, 'web', file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${file} to dist/`);
  } else {
    console.warn(`⚠️  File not found: ${srcPath}`);
  }
});

console.log('🎉 Static files copied successfully!');