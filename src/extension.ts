// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "alldwarf-sql-format" is now active!');
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
			{ language: "sql", scheme: "file" },
			new SqlFormatter()
		),
		vscode.languages.registerDocumentRangeFormattingEditProvider(
			{ language: "sql", scheme: "file" },
			new SqlFormatter()
		)
	);
}

class SqlFormatter implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {
	provideDocumentFormattingEdits(
		document: vscode.TextDocument,
		options: vscode.FormattingOptions,
	): vscode.ProviderResult<vscode.TextEdit[]> {
		const text = document.getText();
		const formattedText = this.formatSql(text, options);
		const range = new vscode.Range(
			document.positionAt(0),
			document.positionAt(text.length)
		);
		return [vscode.TextEdit.replace(range, formattedText)];
	}
	provideDocumentRangeFormattingEdits(
		document: vscode.TextDocument,
		range: vscode.Range,
		options: vscode.FormattingOptions,
		token: vscode.CancellationToken,
	): vscode.ProviderResult<vscode.TextEdit[]> {
		const text = document.getText();
		const formattedText = this.formatSql(text, options);
		return [vscode.TextEdit.replace(range, formattedText)];
	}
	private formatSql(text: string, options: vscode.FormattingOptions): string {
		const lines = text.split('\n');
		const formattedLines = [];

		let indentLevel = 0;
		let lastKeyword = '';
		let lastToken = '';
		let inSelectClause = false;
		let inFromClause = false;
		let inWhereClause = false;
		let inGroupByClause = false;
		let inHavingClause = false;
		let inOrderByClause = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();

			if (line.startsWith('--')) {
				// Ignore comments
				formattedLines.push(line);
				continue;
			}

			if (line === '') {
				// Ignore empty lines
				formattedLines.push(line);
				continue;
			}

			const tokens = line.split(/\s+/);

			for (let j = 0; j < tokens.length; j++) {
				const token = tokens[j];

				if (token === '') {
					// Ignore empty tokens
					continue;
				}

				if (token === '(') {
					indentLevel++;
					formattedLines.push(token);
					continue;
				}

				if (token === ')') {
					indentLevel--;
					formattedLines.push(token);
					continue;
				}

				if (token.toUpperCase() === 'SELECT') {
					inSelectClause = true;
					lastKeyword = token;
					lastToken = token;
					formattedLines.push(token);
					formattedLines.push('');
					indentLevel++;
					continue;
				}

				if (token.toUpperCase() === 'FROM') {
					inSelectClause = false;
					inFromClause = true;
					lastKeyword = token;
					lastToken = token;
					formattedLines.push('');
					formattedLines.push(token);
					indentLevel++;
					continue;
				}

				if (token.toUpperCase() === 'WHERE') {
					inFromClause = false;
					inWhereClause = true;
					lastKeyword = token;
					lastToken = token;
					formattedLines.push('');
					formattedLines.push(token);
					indentLevel++;
					continue;
				}

				if (token.toUpperCase() === 'GROUP' && tokens[j + 1]?.toUpperCase() === 'BY') {
					inWhereClause = false;
					inGroupByClause = true;
					lastKeyword = 'GROUP BY';
					lastToken = 'BY';
					formattedLines.push('');
					formattedLines.push('GROUP BY');
					indentLevel++;
					continue;
				}

				if (token.toUpperCase() === 'HAVING') {
					inGroupByClause = false;
					inHavingClause = true;
					lastKeyword = token;
					lastToken = token;
					formattedLines.push('');
					formattedLines.push(token);
					indentLevel++;
					continue;
				}

				if (token.toUpperCase() === 'ORDER' && tokens[j + 1]?.toUpperCase() === 'BY') {
					inHavingClause = false;
					inOrderByClause = true;
					lastKeyword = 'ORDER BY';
					lastToken = 'BY';
					formattedLines.push('');
					formattedLines.push('ORDER BY');
					indentLevel++;
					continue;
				}

				if (token.toUpperCase() === 'AS') {
					lastToken = token;
					formattedLines.push(` ${token} `);
					continue;
				}

				if (inSelectClause && lastToken === ',' && j % 2 === 0) {
					formattedLines.push('');
					indentLevel++;
				}

				if (inSelectClause && j % 2 === 0) {
					formattedLines.push('\t');
				}

				if (inFromClause && lastToken === ',' && j % 2 === 0) {
					formattedLines.push('');
					indentLevel++;
				}

				if (inWhereClause && lastToken.toUpperCase() === 'AND' && j % 2 === 0) {
					formattedLines.push('');
					indentLevel++;
				}

				if (inGroupByClause && lastToken === ',' && j % 2 === 0) {
					formattedLines.push('');
					indentLevel++;
				}

				if (inHavingClause && lastToken.toUpperCase() === 'AND' && j % 2 === 0) {
					formattedLines.push('');
					indentLevel++;
				}

				if (inOrderByClause && lastToken === ',' && j % 2 === 0) {
					formattedLines.push('');
					indentLevel++;
				}

				if (token.toUpperCase() === 'SELECT' || token.toUpperCase() === 'FROM' || token.toUpperCase() === 'WHERE' || token.toUpperCase() === 'GROUP' || token.toUpperCase() === 'HAVING' || token.toUpperCase() === 'ORDER') {
					lastKeyword = token;
				}

				if (lastKeyword.toUpperCase() === 'SELECT' && j % 2 === 0) {
					formattedLines.push('\t');
				}

				if (lastKeyword.toUpperCase() === 'FROM' && j % 2 === 0) {
					formattedLines.push('\t');
				}

				if (lastKeyword.toUpperCase() === 'WHERE' && j % 2 === 0) {
					formattedLines.push('\t');
				}

				if (lastKeyword.toUpperCase() === 'GROUP BY' && j % 2 === 0) {
					formattedLines.push('\t');
				}

				if (lastKeyword.toUpperCase() === 'HAVING' && j % 2 === 0) {
					formattedLines.push('\t');
				}

				if (lastKeyword.toUpperCase() === 'ORDER BY' && j % 2 === 0) {
					formattedLines.push('\t');
				}

				if (options.transform === 'uppercase') {
					formattedLines.push(token.toUpperCase());
				} else {
					formattedLines.push(token);
				}

				lastToken = token;
			}
		}

		return formattedLines.join('\n');
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }
