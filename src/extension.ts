import * as vscode from 'vscode';
import * as fs from 'fs';

function getWebviewContent(filePath: string): string {
	try {
		// Read file contents synchronously
		const fileContents = fs.readFileSync(__dirname + filePath, 'utf-8');
		return fileContents;
	} catch (err) {
		console.error(`Error reading file: ${err}`);
		return '';
	}
}


class MyWebviewViewProvider implements vscode.WebviewViewProvider {
	resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext<unknown>,
		token: vscode.CancellationToken
	): void | Thenable<void> {
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
			} else if (message.command === 'signOut') {
				// Change the webview's HTML to the contents of index.html
				webviewView.webview.html = getWebviewContent("/index.html");
			} else if (message.command === 'sessionTokenFail') {
				vscode.window.showInformationMessage("Invalid access token. Please try again.");
			} else if (message.command === 'copyToClipboard') {
				vscode.env.clipboard.writeText(message.text)
					.then(() => {
						console.log('Text copied to clipboard');
						// Optionally, you can send a message back to the WebView to indicate the copy was successful
						// For example: vscode.postMessage({ command: 'copySuccess' });
					});
			}
		});
	}
}


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('extension.codemeWebview', new MyWebviewViewProvider())
	);
}

export function deactivate() { }
