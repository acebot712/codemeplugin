"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
function getWebviewContent(filePath) {
    try {
        // Read file contents synchronously
        const fileContents = fs.readFileSync(__dirname + filePath, 'utf-8');
        return fileContents;
    }
    catch (err) {
        console.error(`Error reading file: ${err}`);
        return '';
    }
}
class MyWebviewViewProvider {
    async resolveWebviewView(webviewView, context, token) {
        webviewView.webview.options = { enableScripts: true };
        // Create the initial content of the webview
        webviewView.webview.html = getWebviewContent("/dashboard.html");
        // // Fetch the .gitignore content from the provided URL
        // const url = 'https://www.toptal.com/developers/gitignore/api/data,audio,macos,dotenv,images,python,pycharm,database,visualstudio,jupyternotebooks,visualstudiocode,venv,intellij';
        // let externalGitIgnore: string | null = null;
        // try {
        // 	const response = await axios.get<string>(url);
        // 	externalGitIgnore = response.data;
        // } catch (error) {
        // 	console.error("Failed to fetch .gitignore content:", error);
        // }
        // // Indexing Logic
        // const folderUri = vscode.workspace.workspaceFolders?.[0].uri;
        // if (folderUri) {
        // 	const gitIgnorePath = path.join(folderUri.fsPath, '.gitignore');
        // 	let ig = ignore();
        // 	if (fs.existsSync(gitIgnorePath)) {
        // 		const gitIgnoreContent = fs.readFileSync(gitIgnorePath, 'utf-8');
        // 		ig = ignore().add(gitIgnoreContent);
        // 	}
        // 	// Add the external .gitignore content
        //     if (externalGitIgnore) {
        // 		ig.add(externalGitIgnore);
        // 	}
        // 	const allFiles = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
        // 	const nonIgnoredFiles = allFiles.filter(file => {
        // 		const relativePath = vscode.workspace.asRelativePath(file, false);
        // 		return !ig.ignores(relativePath);
        // 	});
        // 	const contentList: string[] = [];
        // 	for (const file of nonIgnoredFiles) {
        //         const content = fs.readFileSync(file.fsPath, 'utf-8');
        //         contentList.push(content);
        //     }
        // 	console.log("HAHA");
        // 	console.log(contentList.slice(0, 10));
        // 	console.log("NANAN");
        // }
        // Listen for messages from the webview
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'sessionToken') {
                // Change the webview's HTML to the contents of dashboard.html
                const dashboardContent = getWebviewContent("/dashboard.html");
                const userDetails = message.text.split("||");
                // Replace placeholders in dashboardContent with message.command value
                // get userDetails[1] has data.login_id.
                const modifiedDashboardContent = dashboardContent.replace(/"#login_id#"/g, userDetails[1]).replace(/"#user_id#"/g, userDetails[0]);
                webviewView.webview.html = modifiedDashboardContent;
            }
            else if (message.command === 'signOut') {
                // Change the webview's HTML to the contents of index.html
                webviewView.webview.html = getWebviewContent("/dashboard.html");
            }
            else if (message.command === 'sessionTokenFail') {
                vscode.window.showInformationMessage("Invalid access token. Please try again.");
            }
            else if (message.command === 'getHighlightedText') {
                let editor = vscode.window.activeTextEditor;
                if (editor) {
                    let selectedText = editor.document.getText(editor.selection);
                    // Send the selected text back to the webview
                    webviewView.webview.postMessage({ command: 'highlightedText', text: selectedText });
                }
                else {
                    webviewView.webview.postMessage({ command: 'highlightedText', text: "" });
                }
            }
            else if (message.command === 'copyToClipboard') {
                const { text } = message;
                vscode.env.clipboard.writeText(text)
                    .then(() => {
                    vscode.window.showInformationMessage('Code copied to clipboard!');
                });
            }
        });
    }
}
function activate(context) {
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('extension.codemeWebview', new MyWebviewViewProvider()));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map