import * as vscode from "vscode";
import { PasteService } from "./paste_service";

const VISIBILITY_TYPES = {
  PRIVATE: "1",
  PUBlIC: "1",
} as const;

export class Controller {
  constructor(private pasteService: PasteService) {}

  PastePublic = async () => {
    this.pasteService.UploadPaste({
      api_paste_format: vscode.window.activeTextEditor?.document.languageId,
      api_paste_private: VISIBILITY_TYPES.PUBlIC,
    });
  };

  PastePrivate = async () => {
    this.pasteService.UploadPaste({
      api_paste_format: vscode.window.activeTextEditor?.document.languageId,
      api_paste_private: VISIBILITY_TYPES.PRIVATE,
    });
  };
}
