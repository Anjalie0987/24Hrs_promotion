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
  let hasChanges = false;

  // Replace `@Request() req,` or `@Request() req)` with `...: AuthenticatedRequest`
  content = content.replace(/@Request\(\) req(,| \)|\))/g, '@Request() req: AuthenticatedRequest$1');
  content = content.replace(/@Req\(\) req(,| \)|\))/g, '@Req() req: AuthenticatedRequest$1');
  // Handle cases without comma or parenthesis right after (like when followed by another decorator)
  content = content.replace(/@Request\(\) req\n/g, '@Request() req: AuthenticatedRequest\n');
  content = content.replace(/@Req\(\) req\n/g, '@Req() req: AuthenticatedRequest\n');
  // Handle `: any` again just in case
  content = content.replace(/@Request\(\) req: any/g, '@Request() req: AuthenticatedRequest');
  content = content.replace(/@Req\(\) req: any/g, '@Req() req: AuthenticatedRequest');

  if (content !== fs.readFileSync(file, 'utf8')) {
    hasChanges = true;
  }

  if (hasChanges && !content.includes('AuthenticatedRequest')) {
    // Determine relative path for import
    const depth = file.replace(controllersDir, '').split(path.sep).length - 1;
    const prefix = Array(depth).fill('..').join('/');
    const importStatement = `import { AuthenticatedRequest } from '${prefix}/../common/interfaces/authenticated-request.interface';\n`;
    
    // Find last import
    const importRegex = /import .* from '.*';/g;
    let match;
    let lastIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex > 0) {
      content = content.slice(0, lastIndex) + '\n' + importStatement + content.slice(lastIndex);
    } else {
      content = importStatement + content;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
}
