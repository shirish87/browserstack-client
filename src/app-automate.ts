import { APIClient, APIClientOptions } from "@/api";
import { operations } from "./generated/openapi";
import { FetchOptions } from "openapi-fetch";

export default class AppAutomateClient extends APIClient {
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://api.browserstack.com",
    });
  }

  uploadMediaFile(
    body: operations["uploadAppAutomateMediaFile"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateMediaFile"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest("/app-automate/upload-media", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        formData.append("file", body.file, body.filename);
        return formData;
      },
    });
  }

  getMediaFiles(
    options?: FetchOptions<operations["getAppAutomateMediaFiles"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_media_files", options);
  }

  getGroupMediaFiles(
    options?: FetchOptions<operations["getAppAutomateGroupMediaFiles"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_group_media", options);
  }

  deleteMediaFile(
    mediaId: string,
    options?: FetchOptions<operations["deleteAppAutomateMediaFile"]>
  ) {
    return this.makeDeleteRequest(
      "/app-automate/custom_media/delete/{mediaId}",
      {
        ...options,
        params: {
          path: {
            mediaId,
          },
        },
      }
    );
  }
}
