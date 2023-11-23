"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptFileReader = void 0;
const simple_git_1 = require("simple-git");
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
class TypeScriptFileReader {
    constructor(path = "./") {
        this.path = path;
        this.logger = vscode.window.createOutputChannel("TypeScriptFileReader");
    }
    async getGitTrackedFilesContent() {
        const contents = [];
        const git = (0, simple_git_1.default)(this.path);
        try {
            const files = await git.raw(['ls-files']);
            files.split('\n').forEach(file => {
                if (file !== '.gitignore') { // Skip .gitignore file
                    const fullPath = path.join(this.path, file);
                    const fileContent = fs.readFileSync(fullPath, 'utf8');
                    contents.push(`# ${fullPath}\n${fileContent}`);
                }
            });
        }
        catch (e) {
            this.logger.appendLine(`Error occurred while reading the git tracked files. Reason: ${e}`);
        }
        return contents;
    }
}
exports.TypeScriptFileReader = TypeScriptFileReader;
//# sourceMappingURL=typeScriptFileReader.js.map