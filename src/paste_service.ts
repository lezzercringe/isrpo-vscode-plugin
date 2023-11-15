import * as vscode from "vscode";
import { GetSelection } from "./utils/clipboard";
import { AxiosInstance } from "axios";
import { AxiosError } from "axios";

const ROUTE = "api_post.php";

type UploadConfig = {
  api_paste_format?: string;
  api_paste_private?: string;
};

type UploadDto = UploadConfig & {
  api_dev_key: string;
  api_option: "paste";
  api_paste_code: string;
};

type QueryReturnType = {
  link: null | string;
  error: "server" | "language" | null;
};

export class PasteService {
  constructor(private token: string, private fetcher: AxiosInstance) {}

  private async CreatePasteQuery(dto: UploadDto): Promise<QueryReturnType> {
    try {
      console.log(dto.api_paste_private);
      return {
        link: (await this.fetcher.postForm(ROUTE, dto)).data,
        error: null,
      };
    } catch (e) {
      if (
        e instanceof AxiosError &&
        (e.response?.data as string).includes("format")
      ) {
        return { error: "language", link: null };
      }

      return { error: "server", link: null };
    }
  }

  async UploadPaste(config: UploadConfig) {
    const selection = GetSelection();
    if (!selection) {
      vscode.window.showErrorMessage("No text highlighted");
      return;
    }

    const { link, error } = await this.CreatePasteQuery({
      ...config,
      api_dev_key: this.token,
      api_paste_code: selection,
      api_option: "paste",
    });

    if (!link) {
      switch (error) {
        case "language":
          vscode.window.showErrorMessage("Unsupported language");
          break;
        case "server":
          vscode.window.showErrorMessage("Bad server response");
          break;
      }

      return;
    }

    vscode.window.showInformationMessage("Successfuly uploaded");
    vscode.env.clipboard.writeText(link);
  }
}
