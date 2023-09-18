# AllDwarf's SQL Formatter

AllDwarf's SQL Formatter is a Visual Studio Code extension that provides advanced formatting options for SQL code. It uses the `sql-formatter` library to format SQL code according to your custom conditions.

## Features

- Format SQL code using custom conditions.
- Support for formatting SQL code in the entire document or a selected range.
- Integration with the "Format Document" and "Format Document with" commands in Visual Studio Code.

## Installation

To install AllDwarf's SQL Formatter, follow these steps:

1. Open Visual Studio Code.
2. Press `Ctrl+Shift+X` (Windows, Linux) or `Cmd+Shift+X` (macOS) to open the Extensions view.
3. Search for "AllDwarf's SQL Formatter" in the Marketplace.
4. Click the "Install" button next to the extension.
5. Reload Visual Studio Code to activate the extension.

## Usage

To use AllDwarf's SQL Formatter, follow these steps:

1. Open a SQL file in Visual Studio Code.
2. Press `Ctrl+Shift+I` (Windows, Linux) or `Cmd+Shift+I` (macOS) to format the entire document using your custom conditions.
3. Alternatively, select some or all of the SQL code in the file and right-click on the selection. Choose "Format Document with" and select "AllDwarf's SQL Formatter" from the list of available formatters to format the selected code using your custom conditions.

## Configuration

AllDwarf's SQL Formatter supports the following configuration options:

- `alldwarf-sql-format.transform`: Specifies the case transformation to apply to keywords. Valid values are "none", "uppercase", and "lowercase". Default is "none".
- `alldwarf-sql-format.insertFinalNewline`: Specifies whether to insert a newline at the end of the formatted SQL code. Default is false.

To configure these options, open the Visual Studio Code settings editor and search for "AllDwarf's SQL Formatter". You can then modify the settings to your liking.

## License

AllDwarf's SQL Formatter is licensed under the MIT License. See the LICENSE file for more information.