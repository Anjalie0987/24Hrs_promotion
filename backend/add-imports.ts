import * as fs from 'fs';
import * as path from 'path';

function getControllerFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getControllerFiles(filePath, fileList);
    } else if (filePath.endsWith('.controller.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const controllersDir = path.join(__dirname, 'src', 'modules');
const controllerFiles = getControllerFiles(controllersDir);

for (const file of controllerFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('AuthenticatedRequest') && !content.includes('authenticated-request.interface')) {
    const depth = file.replace(controllersDir, '').split(path.sep).length - 1;
    const prefix = Array(depth).fill('..').join('/');
    const importStatement = `import { AuthenticatedRequest } from '${prefix}/../common/interfaces/authenticated-request.interface';\n`;
    
    content = importStatement + content;
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Added import to: ${file}`);
  }
}
