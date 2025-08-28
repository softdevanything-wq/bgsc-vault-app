const fs = require('fs');
const path = require('path');

// Generate build version
const buildVersion = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Create build info
const buildInfo = {
  version: buildVersion,
  timestamp: new Date().toISOString(),
  date: new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
};

// Write to public folder
const publicPath = path.join(__dirname, 'public', 'build-version.json');
fs.writeFileSync(publicPath, JSON.stringify(buildInfo, null, 2));

console.log(`Build version created: ${buildVersion}`);
console.log(`Build info written to: ${publicPath}`);