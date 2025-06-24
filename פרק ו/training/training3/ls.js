const fs = require('fs');
const path = require('path');

const dirPath = process.argv[2] || '.';

if (!fs.existsSync(dirPath)) {
  console.error("❌ the folder don't exist");
  process.exit(1);
}

const items = fs.readdirSync(dirPath);
items.forEach(item => {
  const fullPath = path.join(dirPath, item);
  const stats = fs.statSync(fullPath);
  const type = stats.isDirectory() ? "📁 folder" : "📄 file";
  console.log(`type: ${type} - ${item} | size: ${stats.size} bytes | updeted: ${stats.mtime}`);
});
