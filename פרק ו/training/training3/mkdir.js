const fs = require('fs');
const dirName = process.argv[2];

if (!dirName) {
  console.error("❌ Enter folder name");
  process.exit(1);
}

if (fs.existsSync(dirName)) {
  console.error("⚠️ The folder already exists. ");
} else {
  fs.mkdirSync(dirName);
  console.log("📁 The folder was created successfully.");
}
