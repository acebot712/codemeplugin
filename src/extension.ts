import * as vscode from 'vscode';
import * as fs from 'fs';

function readFileContents(filePath: string): string {
	try {
		// Read file contents synchronously
		const fileContents = fs.readFileSync(__dirname + filePath, 'utf-8');
		return fileContents;
	} catch (err) {
		console.error(`Error reading file: ${err}`);
		return '';
	}
}

// Define a function to get the webview's HTML content
function getWebviewContent() {
	return readFileContents("/dashboard.html");
}

const webviewContent = getWebviewContent();


class MyWebviewViewProvider implements vscode.WebviewViewProvider {
	resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext<unknown>,
		token: vscode.CancellationToken
	): void | Thenable<void> {
		webviewView.webview.options = { enableScripts: true };
		// Create the initial content of the webview
		webviewView.webview.html = webviewContent;
		// Listen for messages from the webview
		webviewView.webview.onDidReceiveMessage((message) => {
			if (message.command === 'sessionToken') {
				console.log(process.cwd());
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
