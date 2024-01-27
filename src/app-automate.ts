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
    return this.makeGetRequest(
      "/app-automate/recent_media_files",
      options
    ).then((data) => ("message" in data ? [] : data));
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
    }).then((data) => ("message" in data ? [] : data));
  }

  getGroupMediaFiles(
    options?: FetchOptions<operations["getAppAutomateGroupMediaFiles"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/recent_group_media",
      options
    ).then((data) => ("message" in data ? [] : data));
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

  uploadAppiumApp(
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
        if ("file" in body) {
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

  getAppiumApps(options?: FetchOptions<operations["getAppAutomateApps"]>) {
    return this.makeGetRequest("/app-automate/recent_apps", options).then(
      (data) => ("message" in data ? [] : data)
    );
  }

  getAppiumAppsByCustomId(
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
    }).then((data) => ("message" in data ? [] : data));
  }

  getAppiumGroupApps(
    options?: FetchOptions<operations["getAppAutomateGroupApps"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_group_apps", options).then(
      (data) => ("message" in data ? [] : data)
    );
  }

  deleteAppiumApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateApp"]>
  ) {
    return this.makeDeleteRequest("/app-automate/app/delete/{appId}", {
      ...options,
      params: {
        path: {
          appId,
        },
      },
    });
  }

  uploadFlutterApp(
    body: operations["uploadAppAutomateFlutterApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateFlutterApp"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest(
      "/app-automate/flutter-integration-tests/v2/android/app",
      {
        ...options,
        body,
        bodySerializer: () => {
          const formData = new FormData();
          if ("file" in body) {
            formData.append("file", body.file, body.filename);
          } else {
            formData.append("url", body.url);
          }

          if (body.custom_id) {
            formData.append("custom_id", body.custom_id);
          }

          return formData;
        },
      }
    );
  }

  getFlutterApps(
    options?: FetchOptions<operations["getAppAutomateFlutterApps"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/flutter-integration-tests/v2/android/apps",
      options
    ).then((data) => ("apps" in data ? data.apps : []));
  }

  getFlutterApp(
    appId: string,
    options?: FetchOptions<operations["getAppAutomateFlutterApp"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      {
        ...options,
        params: {
          path: {
            appId,
          },
        },
      }
    ).then((data) => data.app);
  }

  deleteFlutterApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateFlutterApp"]>
  ) {
    return this.makeDeleteRequest(
      "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
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

  uploadEspressoApp(
    body: operations["uploadAppAutomateEspressoApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateEspressoApp"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest(
      "/app-automate/espresso/v2/app",
      {
        ...options,
        body,
        bodySerializer: () => {
          const formData = new FormData();
          if ("file" in body) {
            formData.append("file", body.file, body.filename);
          } else {
            formData.append("url", body.url);
          }

          if (body.custom_id) {
            formData.append("custom_id", body.custom_id);
          }

          return formData;
        },
      }
    );
  }

  getEspressoApps(
    options?: FetchOptions<operations["getAppAutomateEspressoApps"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/espresso/v2/apps",
      options
    ).then((data) => ("apps" in data ? data.apps : []));
  }

  getEspressoApp(
    appId: string,
    options?: FetchOptions<operations["getAppAutomateEspressoApp"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/espresso/v2/apps/{appId}",
      {
        ...options,
        params: {
          path: {
            appId,
          },
        },
      }
    ).then((data) => data.app);
  }

  deleteEspressoApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateEspressoApp"]>
  ) {
    return this.makeDeleteRequest(
      "/app-automate/espresso/v2/apps/{appId}",
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

  uploadXCUITestApp(
    body: operations["uploadAppAutomateXCUITestApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateXCUITestApp"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest(
      "/app-automate/xcuitest/v2/app",
      {
        ...options,
        body,
        bodySerializer: () => {
          const formData = new FormData();
          if ("file" in body) {
            formData.append("file", body.file, body.filename);
          } else {
            formData.append("url", body.url);
          }

          if (body.custom_id) {
            formData.append("custom_id", body.custom_id);
          }

          return formData;
        },
      }
    );
  }

  getXCUITestApps(
    options?: FetchOptions<operations["getAppAutomateXCUITestApps"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/xcuitest/v2/apps",
      options
    ).then((data) => ("apps" in data ? data.apps : []));
  }

  getXCUITestApp(
    appId: string,
    options?: FetchOptions<operations["getAppAutomateXCUITestApp"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/xcuitest/v2/apps/{appId}",
      {
        ...options,
        params: {
          path: {
            appId,
          },
        },
      }
    ).then((data) => data.app);
  }

  deleteXCUITestApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateXCUITestApp"]>
  ) {
    return this.makeDeleteRequest(
      "/app-automate/xcuitest/v2/apps/{appId}",
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
