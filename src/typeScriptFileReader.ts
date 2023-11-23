import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export class TypeScriptFileReader {
    private path: string;
    private logger: vscode.OutputChannel;

    constructor(path: string = "./") {
        this.path = path;
        this.logger = vscode.window.createOutputChannel("TypeScriptFileReader");
    }

    public async getGitTrackedFilesContent(): Promise<string[]> {
        const contents: string[] = [];
        const git = simpleGit(this.path);

        try {
            const files = await git.raw(['ls-files']);

            files.split('\n').forEach(file => {
                if (file !== '.gitignore') { // Skip .gitignore file
                    const fullPath = path.join(this.path, file);
                    const fileContent = fs.readFileSync(fullPath, 'utf8');
                    contents.push(`# ${fullPath}\n${fileContent}`);
                }
            });
        } catch (e) {
            this.logger.appendLine(`Error occurred while reading the git tracked files. Reason: ${e}`);
        }

        return contents;
    }
}
