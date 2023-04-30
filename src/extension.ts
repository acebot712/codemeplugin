import * as vscode from 'vscode';
import * as fs from 'fs';

const LOGIN_URL = 'http://127.0.0.1:8000';
const COOKIE_NAME = 'my-extension-token';

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


export function activate(context: vscode.ExtensionContext) {

	// vscode.env.openExternal(vscode.Uri.parse(LOGIN_URL));

	// Define a function to create the chatbot view
	function createChatbotView() {
		// Create a webview panel to show the chatbot view
		const panel = vscode.window.createWebviewPanel(
			'exampleWebview', // Identifies the type of the webview. Used internally
			'Example Webview', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
				retainContextWhenHidden: true
			} // Webview options. More on these later.
		);

		panel.webview.html = webviewContent;

		// Listen for messages from the webview
		panel.webview.onDidReceiveMessage((message) => {
			if (message.command === 'sessionToken') {
				const sessionToken = message.value;
				// Do something with the sessionToken value
				console.log(`session_token: ${sessionToken}`);

				console.log(process.cwd());
				// panel.webview.html = webviewContent;
				
			}
		});
	}

	// Register a command to create the chatbot view
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.exampleWebview', () => {
			createChatbotView();
		})
	);

}

export function deactivate() { }
