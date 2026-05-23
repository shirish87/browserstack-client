/**
 * Generated TUI manifest. Do not modify.
 */

import type { TUIProduct } from "./tui-types.js";

export const TUI_MANIFEST: TUIProduct[] = [
  {
    "id": "automate",
    "title": "BrowserStack Automate",
    "description": "BrowserStack Automate API",
    "resources": [
      {
        "id": "default",
        "label": "BrowserStack Automate",
        "actions": [
          {
            "id": "list-browsers",
            "summary": "Fetches all automate browsers.",
            "description": "Fetches all automate browsers.",
            "fields": []
          },
          {
            "id": "get-plan",
            "summary": "Get Automate plan details",
            "description": "Fetches Automate plan details",
            "fields": []
          },
          {
            "id": "list-session-appium-logs",
            "summary": "Fetches Appium logs for a session",
            "description": "Fetches Appium logs for a session. Raw Appium Logs for each session are available to you in text format.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "get-project-badge-key",
            "summary": "Fetches the badge key for the project",
            "description": "Fetches the badge key for sharing a public link for the Automate dashboard to view the latest build and sessions for that project",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "upload-session-terminal-logs",
            "summary": "Upload terminal logs for your session.",
            "description": "Upload terminal logs for your session.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-builds",
            "summary": "Delete multiple builds on the server",
            "description": "Delete multiple builds on the server. You can delete a maximum of 5 builds at a time. Builds once deleted cannot be recovered.",
            "fields": [
              {
                "name": "buildId[]",
                "label": "BuildId[]",
                "description": "",
                "type": "string",
                "required": true,
                "location": "query"
              }
            ]
          },
          {
            "id": "get-session",
            "summary": "Fetches a session",
            "description": "Fetches a session for a particular build",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-session",
            "summary": "Update session status or name",
            "description": "Set the status for a session or update the name of the session. You can mark test status as passed or failed along with a reason.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-session",
            "summary": "Delete a session on the server",
            "description": "Delete a session on the server. Sessions once deleted cannot be recovered",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-sessions",
            "summary": "Delete multiple sessions on the server",
            "description": "Delete multiple sessions on the server. Sessions once deleted cannot be recovered.",
            "fields": [
              {
                "name": "sessionId[]",
                "label": "SessionId[]",
                "description": "",
                "type": "string",
                "required": true,
                "location": "query"
              }
            ]
          },
          {
            "id": "delete-media-file",
            "summary": "Delete a media file earlier uploaded to BrowserStack",
            "description": "Delete a media file on the server. Media files once deleted cannot be recovered",
            "fields": [
              {
                "name": "mediaId",
                "label": "MediaId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "get-build",
            "summary": "Fetches a build",
            "description": "Fetches a build",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-build",
            "summary": "Update the name or tag of your build",
            "description": "Update the name or tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "name",
                "label": "Name",
                "description": "The new build name that you want to set. Accepted characters are A-Z, a-z, 0-9, ., :, -, [], /, @, &, ', _. Character limit is 255.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "build_tag",
                "label": "Build Tag",
                "description": "The new build tag that you want to set",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-build",
            "summary": "Delete a build on the server",
            "description": "Delete a build on the server. Please note that deleting a build will delete all the sessions contained within it. Builds once deleted cannot be recovered",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-session-logs",
            "summary": "Fetches session logs",
            "description": "Fetches session logs. Whenever you execute a session on BrowserStack, a session log is generated. These logs are available to you in text format.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "upload-media-file",
            "summary": "Upload a media file",
            "description": "Upload a media file you want to use in your tests",
            "fields": []
          },
          {
            "id": "recycle-key",
            "summary": "Reset Automate access key",
            "description": "Reset Automate access key",
            "fields": []
          },
          {
            "id": "list-sessions",
            "summary": "Fetches list of sessions",
            "description": "Fetches list of sessions for a particular build",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "offset",
                "label": "Offset",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "running",
                  "timeout",
                  "failed",
                  "done"
                ]
              }
            ]
          },
          {
            "id": "get-project",
            "summary": "Fetches a project",
            "description": "Specific information about a particular project can be queried using the project ID",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-project",
            "summary": "Update the name of your project",
            "description": "Update the name of your project after the project is complete",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "name",
                "label": "Name",
                "description": "Name of your project",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-project",
            "summary": "Delete your project",
            "description": "Delete a project on the server using the DELETE method. Please note that to delete a project, it needs to be empty of builds and sessions, and projects once deleted cannot be recovered",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-session-selenium-logs",
            "summary": "Fetches Selenium logs for a session",
            "description": "Fetches Selenium logs for a session. Raw Selenium logs for each session are available to you in text format.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "upload-build-terminal-logs",
            "summary": "Upload terminal logs for your build.",
            "description": "Upload terminal logs for your build.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-media-files",
            "summary": "Fetches list of uploaded media files",
            "description": "Fetches list of recently uploaded media files",
            "fields": []
          },
          {
            "id": "list-projects",
            "summary": "Fetches list of projects",
            "description": "Fetches list of projects associated with your username and access key. You will need the id of the project for invoking any other Project API that follows in this document",
            "fields": []
          },
          {
            "id": "list-session-console-logs",
            "summary": "Fetches console logs for a session",
            "description": "Fetches console logs for a session. Console logs are enabled by default and are set to errors. You can disable them or change verbosity options by using the browserstack.console capability to disabled, errors, warnings, info, verbose. Raw Console Logs for each session are available to you in text format.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-session-telemetry-logs",
            "summary": "Fetches telemetry logs for a session",
            "description": "Fetches telemetry logs for a session. Telemetry logs for a session are available for tests run using Selenium 4. Telemetry logs are by default disabled for a session.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-builds",
            "summary": "Fetches list of builds",
            "description": "Fetch the 10 recent test builds that have run on BrowserStack. You can also limit the number of builds and paginate through your data",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "offset",
                "label": "Offset",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "running",
                  "timeout",
                  "failed",
                  "done"
                ]
              }
            ]
          },
          {
            "id": "list-session-network-logs",
            "summary": "Fetches network logs for a session",
            "description": "Fetches network logs for a session. Network Logs for each session are available to you in HAR (HTTP Archive) format.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "app-automate",
    "title": "BrowserStack App Automate",
    "description": "BrowserStack App Automate API",
    "resources": [
      {
        "id": "default",
        "label": "BrowserStack App Automate",
        "actions": [
          {
            "id": "get-build",
            "summary": "Fetches a build",
            "description": "Fetches a build",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-build",
            "summary": "Update the tag of your build",
            "description": "Update the tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "build_tag",
                "label": "Build Tag",
                "description": "The new build tag that you want to set",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-build",
            "summary": "Delete a build on the server",
            "description": "Delete a build on the server. Please note that deleting a build will delete all the sessions contained within it. Builds once deleted cannot be recovered",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-media-files-by-custom-id",
            "summary": "Fetches list of uploaded media files by custom ID",
            "description": "Fetches list of recently uploaded media files by custom ID",
            "fields": [
              {
                "name": "customId",
                "label": "CustomId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-session-logs",
            "summary": "Fetches session logs",
            "description": "Access the logs for the session in textual format. It includes information about the test session’s desired capabilities and detailed information about every request and response. You can view all the steps executed in the test and troubleshoot errors for any failed steps.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-apps",
            "summary": "Fetches list of uploaded apps",
            "description": "Fetches list of recently uploaded apps",
            "fields": []
          },
          {
            "id": "list-group-media-files",
            "summary": "Fetches list of uploaded media files for the entire group",
            "description": "Fetches list of recently uploaded media files for the entire group",
            "fields": []
          },
          {
            "id": "get-xcui-test-app",
            "summary": "Get details of an uploaded XCUITest app",
            "description": "Get details of an uploaded XCUITest app",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-xcui-test-app",
            "summary": "Delete a XCUITest app that was previously uploaded to BrowserStack",
            "description": "Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-network-logs",
            "summary": "Fetches network logs",
            "description": "Access the network logs for your session. These logs capture network data such as network traffic, latency, HTTP requests/responses in the HAR (HTTP Archive) format. You can identify any performance bottlenecks or debug failed REST API responses. Network logs are disabled by default.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "upload-build-terminal-logs",
            "summary": "Upload terminal logs for your build.",
            "description": "Upload terminal logs for your build.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "upload-flutter-android-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for Flutter testing.",
            "fields": []
          },
          {
            "id": "upload-detox-android-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for Detox Android testing.",
            "fields": []
          },
          {
            "id": "list-xcui-test-apps",
            "summary": "Fetches list of uploaded XCUITest apps",
            "description": "Fetches list of recently uploaded XCUITest apps",
            "fields": [
              {
                "name": "scope",
                "label": "Scope",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "group",
                  "user"
                ]
              },
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "upload-session-terminal-logs",
            "summary": "Upload terminal logs for your session.",
            "description": "Upload terminal logs for your session.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "get-plan",
            "summary": "Get App Automate plan details",
            "description": "Fetches App Automate plan details",
            "fields": []
          },
          {
            "id": "upload-flutter-ios-app",
            "summary": "Upload a Flutter test package for iOS",
            "description": "Upload the application under test (AUT) for Flutter iOS testing in .zip format.",
            "fields": []
          },
          {
            "id": "upload-detox-android-app-client",
            "summary": "Upload an app client",
            "description": "Upload the app client under test for Detox Android testing.",
            "fields": []
          },
          {
            "id": "upload-xcui-test-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for XCUITest testing.",
            "fields": []
          },
          {
            "id": "get-project",
            "summary": "Fetches a project",
            "description": "Specific information about a particular project can be queried using the project ID",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-project",
            "summary": "Update the name of your project",
            "description": "Update the name of your project after the project is complete",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "name",
                "label": "Name",
                "description": "Name of your project",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-project",
            "summary": "Delete your project",
            "description": "Delete a project on the server using the DELETE method. Please note that to delete a project, it needs to be empty of builds and sessions, and projects once deleted cannot be recovered",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-devices",
            "summary": "Get a list of supported Android and iOS devices",
            "description": "Fetches list of devices supported by App Automate",
            "fields": []
          },
          {
            "id": "list-appium-logs",
            "summary": "Fetches Appium logs",
            "description": "Access the Appium logs for your session. These are logs generated by the Appium server and contain the details about your each Appium command execution in the test session. You can troubleshoot any errors in case your test session failed.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-app",
            "summary": "Delete an app that was previously uploaded to BrowserStack",
            "description": "Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "get-flutter-android-app",
            "summary": "Get details of an uploaded Flutter app",
            "description": "Get details of an uploaded Flutter app",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-flutter-android-app",
            "summary": "Delete a Flutter app that was previously uploaded to BrowserStack",
            "description": "Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "upload-media-file",
            "summary": "Upload a media file",
            "description": "Upload a media file you want to use in your tests",
            "fields": []
          },
          {
            "id": "list-espresso-apps",
            "summary": "Fetches list of uploaded Espresso apps",
            "description": "Fetches list of recently uploaded Espresso apps",
            "fields": [
              {
                "name": "scope",
                "label": "Scope",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "group",
                  "user"
                ]
              },
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "get-app-profiling-data-v2",
            "summary": "Fetches app profiling data v2",
            "description": "Access the detailed app profling metrics such as installed app size, UI rendering metrics, resource consumption metrics, etc.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "get-session",
            "summary": "Fetches a session",
            "description": "Get details of a test session including its status and debugging information such as Appium logs and test video recording",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-session",
            "summary": "Update session status",
            "description": "Set the status for a session. You can mark test status as passed or failed along with a reason.",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "Status of the session",
                "type": "string",
                "required": true,
                "location": "body",
                "enum": [
                  "passed",
                  "failed"
                ]
              },
              {
                "name": "reason",
                "label": "Reason",
                "description": "Reason for marking the session as failed",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-session",
            "summary": "Delete a session on the server",
            "description": "Delete a session on the server. Sessions once deleted cannot be recovered",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-projects",
            "summary": "Retrieve a list of recent projects for your BrowserStack group",
            "description": "Fetch the last 10 projects or your BrowserStack group. You can also limit the number of projects and paginate through your data",
            "fields": [
              {
                "name": "limit",
                "label": "Limit",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "offset",
                "label": "Offset",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "running",
                  "timeout",
                  "failed",
                  "done"
                ]
              }
            ]
          },
          {
            "id": "delete-media-file",
            "summary": "Fetches list of uploaded media files for the entire group",
            "description": "Fetches list of recently uploaded media files for the entire group",
            "fields": [
              {
                "name": "mediaId",
                "label": "MediaId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "get-espresso-app",
            "summary": "Get details of an uploaded Espresso app",
            "description": "Get details of an uploaded Espresso app",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-espresso-app",
            "summary": "Delete a Espresso app that was previously uploaded to BrowserStack",
            "description": "Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-media-files",
            "summary": "Fetches list of uploaded media files",
            "description": "Fetches list of recently uploaded media files",
            "fields": []
          },
          {
            "id": "list-flutter-ios-apps",
            "summary": "Fetches list of uploaded Flutter iOS test packages",
            "description": "Fetches list of recently uploaded Flutter iOS test packages",
            "fields": [
              {
                "name": "scope",
                "label": "Scope",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "group",
                  "user"
                ]
              },
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "upload-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for Appium testing.",
            "fields": []
          },
          {
            "id": "list-group-apps",
            "summary": "Fetches list of uploaded apps for the entire group",
            "description": "Fetches list of recently uploaded apps for the entire group",
            "fields": []
          },
          {
            "id": "upload-espresso-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for Espresso testing.",
            "fields": []
          },
          {
            "id": "list-apps-by-custom-id",
            "summary": "Fetches list of uploaded apps by custom ID",
            "description": "Fetches list of uploaded apps by custom ID",
            "fields": [
              {
                "name": "customId",
                "label": "CustomId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-flutter-android-apps",
            "summary": "Fetches list of uploaded Flutter apps",
            "description": "Fetches list of recently uploaded Flutter apps",
            "fields": [
              {
                "name": "scope",
                "label": "Scope",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "group",
                  "user"
                ]
              },
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-device-logs",
            "summary": "Fetches device logs",
            "description": "Access the device logs for your session. These are system logs specific to your application generated by the OS(Android/iOS) and can be helpful for debugging any application crashes during test execution.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-app-profiling-data-v1",
            "summary": "Fetches app profiling data",
            "description": "Access the app profiling logs to view the resource consumption (CPU, memory, battery, and network) by your app on the device. The logs are only available for Android.",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-builds",
            "summary": "Fetches list of builds",
            "description": "Fetch the 10 recent test builds that have run on BrowserStack. You can also limit the number of builds and paginate through your data",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "offset",
                "label": "Offset",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "running",
                  "timeout",
                  "failed",
                  "done"
                ]
              }
            ]
          },
          {
            "id": "get-flutter-ios-app",
            "summary": "Get details of an uploaded Flutter iOS test package",
            "description": "Get details of an uploaded Flutter iOS test package",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-flutter-ios-app",
            "summary": "Delete a Flutter iOS test package that was previously uploaded to BrowserStack",
            "description": "Delete a Flutter iOS test package that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "get-project-badge-key",
            "summary": "Fetches the badge key for the project",
            "description": "Fetches the badge key for sharing a public link for the Automate dashboard to view the latest build and sessions for that project",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "screenshots",
    "title": "BrowserStack Screenshots",
    "description": "BrowserStack Screenshots API",
    "resources": [
      {
        "id": "default",
        "label": "BrowserStack Screenshots",
        "actions": [
          {
            "id": "get-job",
            "summary": "Fetches a screenshot job",
            "description": "Fetches a screenshot job",
            "fields": [
              {
                "name": "jobId",
                "label": "JobId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "create-job",
            "summary": "Take a screenshot",
            "description": "Take a screenshot of a website on a particular browser",
            "fields": []
          },
          {
            "id": "list-browsers",
            "summary": "Fetches list of browsers",
            "description": "Fetches list of browsers supported by Screenshots API",
            "fields": []
          }
        ]
      }
    ]
  },
  {
    "id": "local-testing",
    "title": "BrowserStack Local Testing",
    "description": "BrowserStack Local Testing API",
    "resources": [
      {
        "id": "default",
        "label": "BrowserStack Local Testing",
        "actions": [
          {
            "id": "list-instances",
            "summary": "Fetches list of recent binary instances",
            "description": "Fetches list of recent binary instances for local testing. Note that the binary should have been started with the --enable-logging-for-api parameter.",
            "fields": [
              {
                "name": "auth_token",
                "label": "Auth Token",
                "description": "Your BrowserStack access token",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "last",
                "label": "Last",
                "description": "The number of recent binary instances to be listed. Maximum value: 100. Default value: 20.",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "state",
                "label": "State",
                "description": "Filter binary instances by state. Accepted values: running, all. Default value: running.",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "running",
                  "all"
                ]
              }
            ]
          },
          {
            "id": "get-instance",
            "summary": "Fetches details of a Local binary instance",
            "description": "Fetches details of a Local binary instance used for local testing. Note that the binary should have been started with the --enable-logging-for-api parameter.",
            "fields": [
              {
                "name": "localInstanceId",
                "label": "LocalInstanceId",
                "description": "The local instance ID",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "auth_token",
                "label": "Auth Token",
                "description": "Your BrowserStack access token",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "disconnect-instance",
            "summary": "Disconnect a Local binary instance",
            "description": "Disconnect a Local binary instance",
            "fields": [
              {
                "name": "localInstanceId",
                "label": "LocalInstanceId",
                "description": "The local instance ID",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "auth_token",
                "label": "Auth Token",
                "description": "Your BrowserStack access token",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "test-management",
    "title": "BrowserStack Test Management",
    "description": "BrowserStack Test Management API",
    "resources": [
      {
        "id": "Projects",
        "label": "Projects",
        "actions": [
          {
            "id": "list-projects",
            "summary": "Get list of projects",
            "description": "",
            "fields": [
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "page_size",
                "label": "Page Size",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query",
                "enum": [
                  "30",
                  "300"
                ]
              }
            ]
          },
          {
            "id": "create-project",
            "summary": "Create a project",
            "description": "",
            "fields": [
              {
                "name": "project",
                "label": "Project",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-project",
            "summary": "Get project details",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-project",
            "summary": "Update a project",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "project",
                "label": "Project",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-project",
            "summary": "Delete a project",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          }
        ]
      },
      {
        "id": "Folders",
        "label": "Folders",
        "actions": [
          {
            "id": "list-folders",
            "summary": "Get list of folders in a project",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "page_size",
                "label": "Page Size",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query",
                "enum": [
                  "30",
                  "300"
                ]
              }
            ]
          },
          {
            "id": "create-folder",
            "summary": "Create a folder",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "folder",
                "label": "Folder",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-folder",
            "summary": "Get folder details",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-folder",
            "summary": "Update a folder",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "folder",
                "label": "Folder",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-folder",
            "summary": "Delete a folder",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "move-folder",
            "summary": "Move a folder",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "parent_id",
                "label": "Parent Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "body"
              }
            ]
          }
        ]
      },
      {
        "id": "TestCases",
        "label": "TestCases",
        "actions": [
          {
            "id": "list-test-cases",
            "summary": "Get list of test cases",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "page_size",
                "label": "Page Size",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query",
                "enum": [
                  "30",
                  "300"
                ]
              },
              {
                "name": "updated_after",
                "label": "Updated After",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "updated_before",
                "label": "Updated Before",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "archived",
                "label": "Archived",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              },
              {
                "name": "minify",
                "label": "Minify",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              },
              {
                "name": "id",
                "label": "Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "priority",
                "label": "Priority",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "owner",
                "label": "Owner",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "case_type",
                "label": "Case Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "folder_id",
                "label": "Folder Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "tags",
                "label": "Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "issue_ids",
                "label": "Issue Ids",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "issue_type",
                "label": "Issue Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "bulk-edit-test-cases",
            "summary": "Bulk edit test cases",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "ids",
                "label": "Ids",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "test_case",
                "label": "Test Case",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "bulk-delete-test-cases",
            "summary": "Bulk delete test cases",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "ids",
                "label": "Ids",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "bulk-archive-test-cases",
            "summary": "Bulk archive test cases",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "ids",
                "label": "Ids",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "bulk-unarchive-test-cases",
            "summary": "Bulk unarchive test cases",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "ids",
                "label": "Ids",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "bulk-edit-test-cases-with-operations",
            "summary": "Bulk edit test cases with operations",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "ids",
                "label": "Ids",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "test_case",
                "label": "Test Case",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "create-test-case",
            "summary": "Create a test case",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_case",
                "label": "Test Case",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "update-test-case",
            "summary": "Update a test case",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_case",
                "label": "Test Case",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-test-case",
            "summary": "Delete a test case",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "archive-test-case",
            "summary": "Archive a test case",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "unarchive-test-case",
            "summary": "Unarchive a test case",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "move-test-case",
            "summary": "Move a test case to a different folder",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "destination_folder_id",
                "label": "Destination Folder Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "body"
              }
            ]
          }
        ]
      },
      {
        "id": "Attachments",
        "label": "Attachments",
        "actions": [
          {
            "id": "list-test-case-attachments",
            "summary": "Get attachments for a test case",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "add-test-case-attachment",
            "summary": "Add attachment to a test case",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "inline",
                "label": "Inline",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "delete-test-case-attachment",
            "summary": "Delete attachment from a test case",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "attachmentId",
                "label": "AttachmentId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-test-result-attachments",
            "summary": "Get attachments for a test result",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testResultId",
                "label": "TestResultId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "add-test-result-attachment",
            "summary": "Add attachment to a test result",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testResultId",
                "label": "TestResultId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-test-result-attachment",
            "summary": "Delete attachment from a test result",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testResultId",
                "label": "TestResultId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "attachmentId",
                "label": "AttachmentId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          }
        ]
      },
      {
        "id": "TestResults",
        "label": "TestResults",
        "actions": [
          {
            "id": "list-test-case-results",
            "summary": "Get test results for a test case across all test runs",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-test-run-results",
            "summary": "Get all test results for a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "validate_tc",
                "label": "Validate Tc",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "add-test-run-results",
            "summary": "Add test result(s) to a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-test-run-test-case-results",
            "summary": "Get test results for a specific test case in a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          }
        ]
      },
      {
        "id": "TestRuns",
        "label": "TestRuns",
        "actions": [
          {
            "id": "list-test-runs",
            "summary": "Get list of test runs",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "closed_before",
                "label": "Closed Before",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "closed_after",
                "label": "Closed After",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "created_before",
                "label": "Created Before",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "created_after",
                "label": "Created After",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "test_plan_id",
                "label": "Test Plan Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "assignee",
                "label": "Assignee",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "include_closed",
                "label": "Include Closed",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              },
              {
                "name": "run_state",
                "label": "Run State",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "create-test-run",
            "summary": "Create a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_run",
                "label": "Test Run",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-test-run",
            "summary": "Get test run details",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "minify",
                "label": "Minify",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-test-run-test-cases",
            "summary": "Get test cases of a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "fetch_steps",
                "label": "Fetch Steps",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              },
              {
                "name": "minify",
                "label": "Minify",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "patch-test-run",
            "summary": "Partially update a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_run",
                "label": "Test Run",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "update-test-run",
            "summary": "Fully update a test run (replaces test cases)",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_run",
                "label": "Test Run",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "assign-test-run-test-cases",
            "summary": "Update assignees of test cases within a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "assign_to",
                "label": "Assign To",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "close-test-run",
            "summary": "Close a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-test-run",
            "summary": "Delete a test run",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          }
        ]
      },
      {
        "id": "TestPlans",
        "label": "TestPlans",
        "actions": [
          {
            "id": "list-test-plans",
            "summary": "Get list of test plans",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "page_size",
                "label": "Page Size",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query",
                "enum": [
                  "30",
                  "300"
                ]
              }
            ]
          },
          {
            "id": "create-test-plan",
            "summary": "Create a test plan",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_plan",
                "label": "Test Plan",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-test-plan",
            "summary": "Get test plan details",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testPlanId",
                "label": "TestPlanId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-test-plan",
            "summary": "Update a test plan",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testPlanId",
                "label": "TestPlanId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_plan",
                "label": "Test Plan",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-test-plan-test-runs",
            "summary": "Get test runs linked to a test plan",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testPlanId",
                "label": "TestPlanId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          }
        ]
      },
      {
        "id": "Configurations",
        "label": "Configurations",
        "actions": [
          {
            "id": "list-configurations",
            "summary": "Get all configurations",
            "description": "",
            "fields": [
              {
                "name": "p",
                "label": "P",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "page_size",
                "label": "Page Size",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query",
                "enum": [
                  "30",
                  "300"
                ]
              }
            ]
          },
          {
            "id": "create-configuration",
            "summary": "Add a custom configuration",
            "description": "",
            "fields": [
              {
                "name": "name",
                "label": "Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-configuration",
            "summary": "Get configuration by ID",
            "description": "",
            "fields": [
              {
                "name": "configurationId",
                "label": "ConfigurationId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          }
        ]
      },
      {
        "id": "CustomFields",
        "label": "CustomFields",
        "actions": [
          {
            "id": "list-custom-fields",
            "summary": "Get all custom fields",
            "description": "",
            "fields": []
          },
          {
            "id": "create-custom-field",
            "summary": "Create a custom field",
            "description": "",
            "fields": [
              {
                "name": "field_name",
                "label": "Field Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "place_holder_text",
                "label": "Place Holder Text",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "field_type",
                "label": "Field Type",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body",
                "enum": [
                  "string",
                  "dropdown",
                  "text",
                  "user",
                  "boolean",
                  "url",
                  "date",
                  "int"
                ]
              },
              {
                "name": "is_required",
                "label": "Is Required",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "options",
                "label": "Options",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "applies_to_all_projects",
                "label": "Applies To All Projects",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "field_entity_type",
                "label": "Field Entity Type",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body",
                "enum": [
                  "test_case",
                  "test_result"
                ]
              },
              {
                "name": "link_to_future_projects",
                "label": "Link To Future Projects",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "assigned_projects",
                "label": "Assigned Projects",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "update-custom-field",
            "summary": "Update a custom field",
            "description": "",
            "fields": [
              {
                "name": "customFieldId",
                "label": "CustomFieldId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "field_name",
                "label": "Field Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "place_holder_text",
                "label": "Place Holder Text",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "field_type",
                "label": "Field Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "is_required",
                "label": "Is Required",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "options",
                "label": "Options",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "applies_to_all_projects",
                "label": "Applies To All Projects",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "field_entity_type",
                "label": "Field Entity Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "link_to_future_projects",
                "label": "Link To Future Projects",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "assigned_projects",
                "label": "Assigned Projects",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-custom-field",
            "summary": "Delete a custom field",
            "description": "",
            "fields": [
              {
                "name": "customFieldId",
                "label": "CustomFieldId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "accessibility",
    "title": "BrowserStack Accessibility",
    "description": "",
    "resources": [
      {
        "id": "default",
        "label": "BrowserStack Accessibility",
        "actions": [
          {
            "id": "list-workflow-analyzer-reports",
            "summary": "List Workflow Analyzer reports",
            "description": "Returns a paginated list of all Workflow Analyzer accessibility reports for your account.",
            "fields": []
          },
          {
            "id": "get-workflow-analyzer-report-summary",
            "summary": "Get Workflow Analyzer report summary",
            "description": "Returns the summary for a specific Workflow Analyzer report, including score, issue counts, and scan metadata.",
            "fields": [
              {
                "name": "report_id",
                "label": "Report Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-workflow-analyzer-report-issues",
            "summary": "Get Workflow Analyzer report issues",
            "description": "Returns the paginated list of accessibility issues for a specific Workflow Analyzer report, optionally filtered by task.",
            "fields": [
              {
                "name": "report_id",
                "label": "Report Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "task_id",
                "label": "Task Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-assisted-test-reports",
            "summary": "List Assisted Test reports",
            "description": "Returns a paginated list of all Assisted Test accessibility reports for your account.",
            "fields": []
          },
          {
            "id": "get-assisted-test-report-summary",
            "summary": "Get Assisted Test report summary",
            "description": "Returns the summary for a specific Assisted Test report, including score, issue counts, and scan metadata.",
            "fields": [
              {
                "name": "report_id",
                "label": "Report Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-assisted-test-report-issues",
            "summary": "Get Assisted Test report issues",
            "description": "Returns the paginated list of accessibility issues for a specific Assisted Test report, optionally filtered by task.",
            "fields": [
              {
                "name": "report_id",
                "label": "Report Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "task_id",
                "label": "Task Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-website-scanner-auth-configs",
            "summary": "List Website Scanner auth configs",
            "description": "Returns all saved authentication configurations used by the Website Scanner for login-protected pages.",
            "fields": []
          },
          {
            "id": "create-website-scanner-auth-config",
            "summary": "Create Website Scanner auth config",
            "description": "Creates a new authentication configuration for the Website Scanner to access login-protected pages during scans.",
            "fields": [
              {
                "name": "name",
                "label": "Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "type",
                "label": "Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "authData",
                "label": "AuthData",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-website-scanner-scans",
            "summary": "List Website Scanner scans",
            "description": "Returns a paginated list of all configured Website Scanner scans for your account.",
            "fields": []
          },
          {
            "id": "create-website-scanner-scan",
            "summary": "Create Website Scanner scan",
            "description": "Creates and triggers a new Website Scanner accessibility scan for the specified URL.",
            "fields": [
              {
                "name": "scan_url",
                "label": "Scan Url",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-website-scanner-scan-overview",
            "summary": "Get Website Scanner scan overview",
            "description": "Returns the configuration overview for a specific Website Scanner scan, including URL list and scan settings.",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-website-scanner-scan-runs",
            "summary": "List Website Scanner scan runs",
            "description": "Returns a paginated list of all scan runs for a specific Website Scanner scan, including status and issue counts.",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "page",
                "label": "Page",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "page_size",
                "label": "Page Size",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "get-website-scanner-scan-run-summary",
            "summary": "Get Website Scanner scan run summary",
            "description": "Returns a detailed summary for a specific scan run, including score, issue counts, and changes since the last run.",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "scan_run_id",
                "label": "Scan Run Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-website-scanner-scan-run-status",
            "summary": "Get Website Scanner scan run status",
            "description": "Returns the current execution status of a specific Website Scanner scan run.",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "scan_run_id",
                "label": "Scan Run Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-website-scanner-scan-run-issues",
            "summary": "Get Website Scanner scan run issues",
            "description": "Returns paginated accessibility issues found during a specific Website Scanner scan run, optionally filtered by task.",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "scan_run_id",
                "label": "Scan Run Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "task_id",
                "label": "Task Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-website-scanner-scan-run-logs",
            "summary": "Get Website Scanner scan run logs",
            "description": "Returns the crawl logs for a specific Website Scanner scan run, including per-URL status, redirects, and errors.",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "scan_run_id",
                "label": "Scan Run Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-automated-test-projects",
            "summary": "List Automated Test projects",
            "description": "Returns a paginated list of all Automated Test accessibility projects for your account.",
            "fields": [
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-automated-test-builds",
            "summary": "List Automated Test builds",
            "description": "Returns a paginated list of Automated Test accessibility builds, optionally filtered by project.",
            "fields": [
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-automated-test-build-test-cases",
            "summary": "List test cases for an Automated Test build",
            "description": "Returns the paginated list of test cases and their accessibility results for a specific Automated Test build.",
            "fields": [
              {
                "name": "thBuildId",
                "label": "ThBuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "get-automated-test-build-summary",
            "summary": "Get Automated Test build summary",
            "description": "Returns the summary for a specific Automated Test build, including score, health stats, and issue counts.",
            "fields": [
              {
                "name": "thBuildId",
                "label": "ThBuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-automated-test-build-issues",
            "summary": "Get Automated Test build issues",
            "description": "Returns paginated accessibility issues for a specific Automated Test build, optionally filtered by task.",
            "fields": [
              {
                "name": "build_id",
                "label": "Build Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "task_id",
                "label": "Task Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "get-automated-test-build-test-case-summary",
            "summary": "Get Automated Test case summary",
            "description": "Returns the accessibility summary for a specific test case within an Automated Test build.",
            "fields": [
              {
                "name": "thBuildId",
                "label": "ThBuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_case_id",
                "label": "Test Case Id",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-automated-test-build-test-case-issues",
            "summary": "Get Automated Test case issues",
            "description": "Returns paginated accessibility issues for a specific test case within an Automated Test build.",
            "fields": [
              {
                "name": "thBuildId",
                "label": "ThBuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "test_case",
                "label": "Test Case",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "task_id",
                "label": "Task Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "test-reporting",
    "title": "BrowserStack Test Reporting & Analytics (TestReporting)",
    "description": "API for BrowserStack Test Reporting & Analytics",
    "resources": [
      {
        "id": "default",
        "label": "BrowserStack Test Reporting & Analytics (TestReporting)",
        "actions": [
          {
            "id": "list-projects",
            "summary": "Get Project List",
            "description": "",
            "fields": [
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "list-project-builds",
            "summary": "Get Build List for Project",
            "description": "",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path"
              },
              {
                "name": "unique_build_names",
                "label": "Unique Build Names",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "build_tags",
                "label": "Build Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "build_status",
                "label": "Build Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "passed",
                  "failed",
                  "unknown",
                  "skipped",
                  "running"
                ]
              },
              {
                "name": "users",
                "label": "Users",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "frameworks",
                "label": "Frameworks",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "is_archived",
                "label": "Is Archived",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              },
              {
                "name": "date_range",
                "label": "Date Range",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "start-build",
            "summary": "Start Build (ingestion)",
            "description": "",
            "fields": []
          },
          {
            "id": "get-latest-build",
            "summary": "Get Latest Build",
            "description": "",
            "fields": [
              {
                "name": "project_name",
                "label": "Project Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "query"
              },
              {
                "name": "build_name",
                "label": "Build Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "user_name",
                "label": "User Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "build_tags",
                "label": "Build Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "framework",
                "label": "Framework",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "get-build",
            "summary": "Get Build Details",
            "description": "",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-build",
            "summary": "Update Build Metadata",
            "description": "",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "build_tags",
                "label": "Build Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "finish-build",
            "summary": "Finish Build (ingestion)",
            "description": "",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "finished_at",
                "label": "Finished At",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "start-test-run",
            "summary": "Start Test Run (ingestion)",
            "description": "",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "finish-test-run",
            "summary": "Finish Test Run (ingestion)",
            "description": "",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "testRunUuid",
                "label": "TestRunUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "start-hook-run",
            "summary": "Start Hook Run (ingestion)",
            "description": "",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "finish-hook-run",
            "summary": "Finish Hook Run (ingestion)",
            "description": "",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "hookRunUuid",
                "label": "HookRunUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "add-build-logs",
            "summary": "Add Build Logs (ingestion)",
            "description": "",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "logs",
                "label": "Logs",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-test-runs",
            "summary": "Get Test List",
            "description": "",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "re_runs",
                "label": "Re Runs",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "test_statuses",
                "label": "Test Statuses",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "is_flaky",
                "label": "Is Flaky",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              },
              {
                "name": "is_new_failure",
                "label": "Is New Failure",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              },
              {
                "name": "sort",
                "label": "Sort",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "EXECUTION_ORDER",
                  "TOP_LEVEL_NAME",
                  "DURATION",
                  "FAILED_TEST",
                  "PLATFORM"
                ]
              },
              {
                "name": "order",
                "label": "Order",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "enum": [
                  "Asc",
                  "Desc"
                ]
              },
              {
                "name": "next_page",
                "label": "Next Page",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query"
              }
            ]
          },
          {
            "id": "get-self-healing-report",
            "summary": "Get Self-Healing Report",
            "description": "",
            "fields": [
              {
                "name": "buildUuid",
                "label": "BuildUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-quality-gate-status",
            "summary": "Get Quality Gate Status",
            "description": "",
            "fields": [
              {
                "name": "buildUuid",
                "label": "BuildUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "list-quality-gate-settings",
            "summary": "Get Quality Gate Settings",
            "description": "",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-quality-gate-settings",
            "summary": "Update Quality Gate Settings",
            "description": "",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "enabled",
                "label": "Enabled",
                "description": "",
                "type": "boolean",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "create-quality-gate-profile",
            "summary": "Create Quality Gate Profile",
            "description": "",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "get-quality-gate-profile",
            "summary": "Get Quality Gate Profile",
            "description": "",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "profileUuid",
                "label": "ProfileUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "update-quality-gate-profile",
            "summary": "Update Quality Gate Profile",
            "description": "",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "profileUuid",
                "label": "ProfileUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "delete-quality-gate-profile",
            "summary": "Delete Quality Gate Profile",
            "description": "",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "profileUuid",
                "label": "ProfileUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              }
            ]
          },
          {
            "id": "toggle-quality-gate-profile",
            "summary": "Toggle Quality Gate Profile",
            "description": "",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "profileUuid",
                "label": "ProfileUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "enabled",
                "label": "Enabled",
                "description": "",
                "type": "boolean",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "upload-report",
            "summary": "Upload Test Reports (JUnit or Allure)",
            "description": "",
            "fields": []
          }
        ]
      }
    ]
  }
];
