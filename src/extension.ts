import * as vscode from "vscode";
import axios from "axios";
import "dotenv/config";
import { Controller } from "./cmd_controller";
import { PasteService } from "./paste_service";

export function activate(context: vscode.ExtensionContext) {
  let token = process.env.TOKEN;
  console.log(process.env);

  if (!token) {
    vscode.window.showErrorMessage("No token specified");
    token = "";
  }

  const apiInstance = axios.create({
    baseURL: "https://pastebin.com/api",
  });

  const service = new PasteService(token, apiInstance);

  const controller = new Controller(service);

  let private_paste = vscode.commands.registerCommand(
    "pastebin-sharer.PastePrivate",
    controller.PastePrivate
  );

  let public_paste = vscode.commands.registerCommand(
    "pastebin-sharer.PastePublic",
    controller.PastePublic
  );

  context.subscriptions.push(private_paste);
  context.subscriptions.push(public_paste);
}

export function deactivate() {}
