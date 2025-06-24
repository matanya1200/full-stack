const fs = require('fs');

const args = process.argv.slice(2);
const destFile = args.pop();
const mode = args.includes('--append') ? 'a' : 'w';
const files = args.filter(f => f !== '--append');

if (files.length === 0 || !destFile) {
  console.error("❌ שימוש: node cat.js [--append] file1 file2 ... dest.txt");
  process.exit(1);
}

try {
  const stream = fs.createWriteStream(destFile, { flags: mode });

  files.forEach(file => {
    if (!fs.existsSync(file)) {
      console.warn(`⚠️ הקובץ ${file} לא קיים - מדולג`);
      return;
    }
    const content = fs.readFileSync(file, 'utf8');
    if(mode == 'a'){
        stream.write('\n');
    }
    stream.write(content + '\n');
  });

  stream.close();
  console.log("✅ תוכן הועבר לקובץ:", destFile);
} catch (err) {
  console.error("❌ שגיאה:", err.message);
}
