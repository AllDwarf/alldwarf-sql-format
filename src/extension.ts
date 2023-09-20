import * as vscode from "vscode";
import * as sqlFormatter from "sql-formatter";

// Create the class for the formatter
class SqlFormatter
    implements
    vscode.DocumentFormattingEditProvider,
    vscode.DocumentRangeFormattingEditProvider {
    private sqlFormatter: any;
    private formatted: string;
    private token: any;
    // private tokenIndex: number;

    // This is the constructor for the class
    constructor() {
        // Create the SQL formatter instance
        this.sqlFormatter = sqlFormatter;
        this.formatted = "";
    }

    // This method is called when the formatter is used on the entire document
    provideDocumentFormattingEdits(
        document: vscode.TextDocument
    ): vscode.TextEdit[] {
        // Get the text from the document
        const text = document.getText();
        // Format the text and specify the language
        try {
            this.formatted = this.sqlFormatter.format(text, { language: "tsql" });
        } catch (e) {
            console.warn(e);

        }
        // Get the last line of the document
        const lastLine = document.lineAt(document.lineCount - 1);
        // Create a range for the entire document
        const documentRange = new vscode.Range(
            document.positionAt(0),
            lastLine.range.end
        );
        // Return the formatted text
        return [vscode.TextEdit.replace(documentRange, this.formatted)];
    }

    // This method is called when the formatter is used on a range of text
    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range
    ): vscode.TextEdit[] {
        // Get the text from the range
        const text = document.getText(range);
        // Format the text and specify the language
        // Also do it in try catch block to avoid error
        try {
            this.formatted = this.sqlFormatter.format(text, { language: "tsql" });
        } catch (e) {
            console.warn(e);

        }
        // Return the formatted text
        return [vscode.TextEdit.replace(range, this.formatted)];
    }
    //     private async getAllSqlKeywords(preFormated: string) {
    //         const lines = preFormated.split(/\r?\n/g);
    //         const language = "mssql";
    //         const configuration = vscode.languages.getLanguages().find((lang) => lang.id === language));
    //         const keywords = configuration.keywords;
    //         return keywords ? keywords.map((keyword) => keyword.toUpperCase()) : [];

    //         for (const language of sqlLanguages) {
    //             const keywords = sqlLanguages[0].keywords;
    //             if (keywords) {
    //               for (const keyword of keywords) {
    //                 sqlKeywords.add(keyword.toUpperCase());
    //               }
    //             }
    //           }
    //           for (let i = 0; i < lines.length; i++) {
    // 			const line = lines[i].trim();
    // 			const tokens = line.split(/\s+/);
    // 			for (let j = 0; j < tokens.length; j++) {
    // 				this.token = tokens[j];
    //                 this.tokenIndex = j;

    // 			}
    // 		}
    //             return Array.from(sqlKeywords);
    //         }


}

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log(
        'Congratulations, your extension "alldwarf-sql-format" is now active!'
    );
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider(
            [
                { language: "sql", scheme: "file" },
                { language: "mysql", scheme: "file" },
                { language: "pgsql", scheme: "file" },
                { language: "mssql", scheme: "file" },
            ],
            new SqlFormatter())
    ),
        vscode.languages.registerDocumentRangeFormattingEditProvider(
            [
                { language: "sql", scheme: "file" },
                { language: "mysql", scheme: "file" },
                { language: "pgsql", scheme: "file" },
                { language: "mssql", scheme: "file" },
            ],
            new SqlFormatter()
        );
}
// this method is called when your extension is deactivated
export function deactivate() { }
