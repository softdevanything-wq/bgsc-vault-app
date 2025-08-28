// 빌드 버전을 index.html에 추가하는 스크립트
const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, '..', 'build', 'index.html');
const timestamp = new Date().getTime();

if (fs.existsSync(buildPath)) {
  let html = fs.readFileSync(buildPath, 'utf8');
  
  // 모든 JS, CSS 파일에 타임스탬프 추가
  html = html.replace(/(src|href)="([^"]+\.(js|css))"/g, `$1="$2?v=${timestamp}"`);
  
  // 빌드 버전 메타 태그 추가
  html = html.replace('</head>', `  <meta name="build-version" content="${timestamp}" />\n</head>`);
  
  fs.writeFileSync(buildPath, html);
  console.log(`Build version ${timestamp} added to index.html`);
} else {
  console.error('Build directory not found. Run npm run build first.');
}