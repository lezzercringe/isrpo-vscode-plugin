import * as vscode from "vscode";

export function GetSelection(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }
  const selection = editor.selection;
  if (!selection || selection.isEmpty) {
    return null;
  }
  const selectionRange = new vscode.Range(
    selection.start.line,
    selection.start.character,
    selection.end.line,
    selection.end.character
  );

  const highlighted = editor.document.getText(selectionRange);

  return highlighted;
}
