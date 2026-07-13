"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getControllerFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getControllerFiles(filePath, fileList);
        }
        else if (filePath.endsWith('.controller.ts')) {
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
//# sourceMappingURL=add-imports.js.map