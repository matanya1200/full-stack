const fs = require('fs');
const dirName = process.argv[2];

if (!dirName || !fs.existsSync(dirName)) {
  console.error("❌ the folder doesn't exist");
  process.exit(1);
}

if (fs.readdirSync(dirName).length > 0) {
  console.error("⚠️ the folder not empty");
} else {
  fs.rmdirSync(dirName);
  console.log("🗑️ the folder has been removed");
}
