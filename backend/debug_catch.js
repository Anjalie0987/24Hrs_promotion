const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Running npm run start...");
  execSync('npx nest start', { stdio: 'pipe' });
  console.log("Success");
} catch (e) {
  fs.writeFileSync('error_dump.txt', e.stderr ? e.stderr.toString() : e.message);
  fs.appendFileSync('error_dump.txt', '\n\nSTDOUT:\n' + (e.stdout ? e.stdout.toString() : ''));
  console.log("Error written to error_dump.txt");
}
