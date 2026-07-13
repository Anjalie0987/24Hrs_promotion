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
  if (content.includes('../../../common/interfaces/authenticated-request.interface')) {
    content = content.replace('../../../common/interfaces/authenticated-request.interface', '../../common/interfaces/authenticated-request.interface');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed import in: ${file}`);
  }
}
