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
    resolveWebviewView(webviewView, context, token) {
        webviewView.webview.options = { enableScripts: true };
        // Create the initial content of the webview
        webviewView.webview.html = getWebviewContent("/index.html");
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
                webviewView.webview.html = getWebviewContent("/index.html");
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