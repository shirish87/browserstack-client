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

        if (body.custom_id) {
          formData.append("custom_id", body.custom_id);
        }

        return formData;
      },
    });
  }

  getMediaFiles(
    options?: FetchOptions<operations["getAppAutomateMediaFiles"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_media_files", options);
  }

  getMediaFilesByCustomId(
    customId: string,
    options?: FetchOptions<operations["getAppAutomateMediaFilesByCustomId"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_media_files/{customId}", {
      ...options,
      params: {
        path: {
          customId,
        },
      },
    });
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

  uploadApp(
    body: operations["uploadAppAutomateApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateApp"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest("/app-automate/upload", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        if ('file' in body) {
          formData.append("file", body.file, body.filename);
        } else {
          formData.append("url", body.url);
        }

        if (body.custom_id) {
          formData.append("custom_id", body.custom_id);
        }

        return formData;
      },
    });
  }

  getApps(
    options?: FetchOptions<operations["getAppAutomateApps"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_apps", options);
  }

  getAppsByCustomId(
    customId: string,
    options?: FetchOptions<operations["getAppAutomateAppsByCustomId"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_apps/{customId}", {
      ...options,
      params: {
        path: {
          customId,
        },
      },
    });
  }

  getGroupApps(
    options?: FetchOptions<operations["getAppAutomateGroupApps"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_group_apps", options);
  }

  deleteApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateApp"]>
  ) {
    return this.makeDeleteRequest(
      "/app-automate/app/delete/{appId}",
      {
        ...options,
        params: {
          path: {
            appId,
          },
        },
      }
    );
  }
}
