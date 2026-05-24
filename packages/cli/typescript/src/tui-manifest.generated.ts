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
            "section": "Account",
            "fields": []
          },
          {
            "id": "get-plan",
            "summary": "Get Automate plan details",
            "description": "Fetches Automate plan details",
            "section": "Account",
            "fields": []
          },
          {
            "id": "list-session-appium-logs",
            "summary": "Fetches Appium logs for a session",
            "description": "Fetches Appium logs for a session. Raw Appium Logs for each session are available to you in text format.",
            "section": "Session Logs",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              }
            ]
          },
          {
            "id": "get-project-badge-key",
            "summary": "Fetches the badge key for the project",
            "description": "Fetches the badge key for sharing a public link for the Automate dashboard to view the latest build and sessions for that project",
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "upload-session-terminal-logs",
            "summary": "Upload terminal logs for your session.",
            "description": "Upload terminal logs for your session.",
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the terminal log file on your machine. The max allowed file size is 2MB",
                "type": "file",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-builds",
            "summary": "Delete multiple builds on the server",
            "description": "Delete multiple builds on the server. You can delete a maximum of 5 builds at a time. Builds once deleted cannot be recovered.",
            "section": "Builds",
            "fields": [
              {
                "name": "buildId[]",
                "label": "BuildId[]",
                "description": "IDs of your builds",
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
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-session",
            "summary": "Update session status or name",
            "description": "Set the status for a session or update the name of the session. You can mark test status as passed or failed along with a reason.",
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              },
              {
                "name": "status",
                "label": "Status",
                "description": "Status of the session",
                "type": "string",
                "required": false,
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
                "required": false,
                "location": "body"
              },
              {
                "name": "name",
                "label": "Name",
                "description": "Name of the session",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-session",
            "summary": "Delete a session on the server",
            "description": "Delete a session on the server. Sessions once deleted cannot be recovered",
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              }
            ]
          },
          {
            "id": "delete-sessions",
            "summary": "Delete multiple sessions on the server",
            "description": "Delete multiple sessions on the server. Sessions once deleted cannot be recovered.",
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId[]",
                "label": "SessionId[]",
                "description": "IDs of your sessions",
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
            "section": "Media Files",
            "fields": [
              {
                "name": "mediaId",
                "label": "MediaId",
                "description": "ID of your media file",
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
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-build",
            "summary": "Update the name or tag of your build",
            "description": "Update the name or tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.",
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-session-logs",
            "summary": "Fetches session logs",
            "description": "Fetches session logs. Whenever you execute a session on BrowserStack, a session log is generated. These logs are available to you in text format.",
            "section": "Session Logs",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              }
            ]
          },
          {
            "id": "upload-media-file",
            "summary": "Upload a media file",
            "description": "Upload a media file you want to use in your tests",
            "section": "Media Files",
            "fields": [
              {
                "name": "file",
                "label": "File",
                "description": "Path to the media file on your machine. Note: You can upload up to 10 media files on the BrowserStack server. By default, we delete the uploaded files after 30 days from the date of upload.",
                "type": "file",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "recycle-key",
            "summary": "Reset Automate access key",
            "description": "Reset Automate access key",
            "section": "Account",
            "fields": []
          },
          {
            "id": "list-sessions",
            "summary": "Fetches list of sessions",
            "description": "Fetches list of sessions for a particular build",
            "section": "Sessions",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "Specify the number of results to be displayed. The default value is 10, and the maximum value is 100",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "offset",
                "label": "Offset",
                "description": "Retrieve sessions from a specific point using the offset parameter",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "Status of the session",
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
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-project",
            "summary": "Update the name of your project",
            "description": "Update the name of your project after the project is complete",
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-session-selenium-logs",
            "summary": "Fetches Selenium logs for a session",
            "description": "Fetches Selenium logs for a session. Raw Selenium logs for each session are available to you in text format.",
            "section": "Session Logs",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              }
            ]
          },
          {
            "id": "upload-build-terminal-logs",
            "summary": "Upload terminal logs for your build.",
            "description": "Upload terminal logs for your build.",
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the terminal log file on your machine. The max allowed file size is 2MB",
                "type": "file",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-media-files",
            "summary": "Fetches list of uploaded media files",
            "description": "Fetches list of recently uploaded media files",
            "section": "Media Files",
            "fields": []
          },
          {
            "id": "list-projects",
            "summary": "Fetches list of projects",
            "description": "Fetches list of projects associated with your username and access key. You will need the id of the project for invoking any other Project API that follows in this document",
            "section": "Projects",
            "fields": []
          },
          {
            "id": "list-session-console-logs",
            "summary": "Fetches console logs for a session",
            "description": "Fetches console logs for a session. Console logs are enabled by default and are set to errors. You can disable them or change verbosity options by using the browserstack.console capability to disabled, errors, warnings, info, verbose. Raw Console Logs for each session are available to you in text format.",
            "section": "Session Logs",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-session-telemetry-logs",
            "summary": "Fetches telemetry logs for a session",
            "description": "Fetches telemetry logs for a session. Telemetry logs for a session are available for tests run using Selenium 4. Telemetry logs are by default disabled for a session.",
            "section": "Session Logs",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-builds",
            "summary": "Fetches list of builds",
            "description": "Fetch the 10 recent test builds that have run on BrowserStack. You can also limit the number of builds and paginate through your data",
            "section": "Builds",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": false,
                "location": "query",
                "picker": {
                  "source": "automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "Specify the number of results to be displayed. The default value is 10, and the maximum value is 100",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "offset",
                "label": "Offset",
                "description": "Retrieve builds from a specific point using the offset parameter",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "Status of the build",
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
            "section": "Session Logs",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "automate.list-sessions",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "buildId"
                  ]
                }
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
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-build",
            "summary": "Update the tag of your build",
            "description": "Update the tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.",
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-media-files-by-custom-id",
            "summary": "Fetches list of uploaded media files by custom ID",
            "description": "Fetches list of recently uploaded media files by custom ID",
            "section": "Media Files",
            "fields": [
              {
                "name": "customId",
                "label": "CustomId",
                "description": "Filter recently uploaded media files by custom ID.",
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
            "section": "Session Logs",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Apps",
            "fields": []
          },
          {
            "id": "list-group-media-files",
            "summary": "Fetches list of uploaded media files for the entire group",
            "description": "Fetches list of recently uploaded media files for the entire group",
            "section": "Media Files",
            "fields": []
          },
          {
            "id": "get-xcui-test-app",
            "summary": "Get details of an uploaded XCUITest app",
            "description": "Get details of an uploaded XCUITest app",
            "section": "XCUITest Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "App ID of your app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "delete-xcui-test-app",
            "summary": "Delete a XCUITest app that was previously uploaded to BrowserStack",
            "description": "Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "section": "XCUITest Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "ID of your uploaded app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-network-logs",
            "summary": "Fetches network logs",
            "description": "Access the network logs for your session. These logs capture network data such as network traffic, latency, HTTP requests/responses in the HAR (HTTP Archive) format. You can identify any performance bottlenecks or debug failed REST API responses. Network logs are disabled by default.",
            "section": "Session Logs",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the terminal log file on your machine. The max allowed file size is 2MB",
                "type": "file",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "upload-flutter-android-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for Flutter testing.",
            "section": "Flutter Android Apps",
            "fields": [
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "file",
                "required": false,
                "location": "body"
              },
              {
                "name": "url",
                "label": "Url",
                "description": "URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "upload-detox-android-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for Detox Android testing.",
            "section": "Detox Android Apps",
            "fields": [
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "file",
                "required": false,
                "location": "body"
              },
              {
                "name": "url",
                "label": "Url",
                "description": "URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-xcui-test-apps",
            "summary": "Fetches list of uploaded XCUITest apps",
            "description": "Fetches list of recently uploaded XCUITest apps",
            "section": "XCUITest Apps",
            "fields": [
              {
                "name": "scope",
                "label": "Scope",
                "description": "Show recent apps at a group level or user level.",
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
                "description": "Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "Number of recent apps to be fetched. Default is 10.",
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
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the terminal log file on your machine. The max allowed file size is 2MB",
                "type": "file",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-plan",
            "summary": "Get App Automate plan details",
            "description": "Fetches App Automate plan details",
            "section": "Account",
            "fields": []
          },
          {
            "id": "upload-flutter-ios-app",
            "summary": "Upload a Flutter test package for iOS",
            "description": "Upload the application under test (AUT) for Flutter iOS testing in .zip format.",
            "section": "Flutter iOS Apps",
            "fields": [
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "file",
                "required": false,
                "location": "body"
              },
              {
                "name": "url",
                "label": "Url",
                "description": "URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "upload-detox-android-app-client",
            "summary": "Upload an app client",
            "description": "Upload the app client under test for Detox Android testing.",
            "section": "Detox Android Apps",
            "fields": [
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the app file on your machine. Supported file formats are .apk and .aab files for Android",
                "type": "file",
                "required": false,
                "location": "body"
              },
              {
                "name": "url",
                "label": "Url",
                "description": "URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "upload-xcui-test-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for XCUITest testing.",
            "section": "XCUITest Apps",
            "fields": [
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "file",
                "required": false,
                "location": "body"
              },
              {
                "name": "url",
                "label": "Url",
                "description": "URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-project",
            "summary": "Fetches a project",
            "description": "Specific information about a particular project can be queried using the project ID",
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-project",
            "summary": "Update the name of your project",
            "description": "Update the name of your project after the project is complete",
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-devices",
            "summary": "Get a list of supported Android and iOS devices",
            "description": "Fetches list of devices supported by App Automate",
            "section": "Account",
            "fields": []
          },
          {
            "id": "list-appium-logs",
            "summary": "Fetches Appium logs",
            "description": "Access the Appium logs for your session. These are logs generated by the Appium server and contain the details about your each Appium command execution in the test session. You can troubleshoot any errors in case your test session failed.",
            "section": "Session Logs",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "ID of your uploaded app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "get-flutter-android-app",
            "summary": "Get details of an uploaded Flutter app",
            "description": "Get details of an uploaded Flutter app",
            "section": "Flutter Android Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "App ID of your app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "delete-flutter-android-app",
            "summary": "Delete a Flutter app that was previously uploaded to BrowserStack",
            "description": "Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "section": "Flutter Android Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "ID of your uploaded app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "upload-media-file",
            "summary": "Upload a media file",
            "description": "Upload a media file you want to use in your tests",
            "section": "Media Files",
            "fields": [
              {
                "name": "file",
                "label": "File",
                "description": "Path to the media file on your machine. Note: You can upload up to 10 media files on the BrowserStack server. By default, we delete the uploaded files after 30 days from the date of upload.",
                "type": "file",
                "required": true,
                "location": "body"
              },
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "Custom ID for the media file. This ID is used to specify the media files to be used in your tests.",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-espresso-apps",
            "summary": "Fetches list of uploaded Espresso apps",
            "description": "Fetches list of recently uploaded Espresso apps",
            "section": "Espresso Apps",
            "fields": [
              {
                "name": "scope",
                "label": "Scope",
                "description": "Show recent apps at a group level or user level.",
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
                "description": "Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "Number of recent apps to be fetched. Default is 10.",
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
            "section": "Apps",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Sessions",
            "fields": [
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Projects",
            "fields": [
              {
                "name": "limit",
                "label": "Limit",
                "description": "Specify the number of results to be displayed. The default value is 10, and the maximum value is 100",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "offset",
                "label": "Offset",
                "description": "Retrieve projects from a specific point using the offset parameter",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "Status of the build",
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
            "section": "Media Files",
            "fields": [
              {
                "name": "mediaId",
                "label": "MediaId",
                "description": "ID of your media file",
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
            "section": "Espresso Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "App ID of your app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "delete-espresso-app",
            "summary": "Delete a Espresso app that was previously uploaded to BrowserStack",
            "description": "Delete an app that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "section": "Espresso Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "ID of your uploaded app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-media-files",
            "summary": "Fetches list of uploaded media files",
            "description": "Fetches list of recently uploaded media files",
            "section": "Media Files",
            "fields": []
          },
          {
            "id": "list-flutter-ios-apps",
            "summary": "Fetches list of uploaded Flutter iOS test packages",
            "description": "Fetches list of recently uploaded Flutter iOS test packages",
            "section": "Flutter iOS Apps",
            "fields": [
              {
                "name": "scope",
                "label": "Scope",
                "description": "Show recent apps at a group level or user level.",
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
                "description": "Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "Number of recent apps to be fetched. Default is 10.",
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
            "section": "Apps",
            "fields": [
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "file",
                "required": false,
                "location": "body"
              },
              {
                "name": "url",
                "label": "Url",
                "description": "URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-group-apps",
            "summary": "Fetches list of uploaded apps for the entire group",
            "description": "Fetches list of recently uploaded apps for the entire group",
            "section": "Apps",
            "fields": []
          },
          {
            "id": "upload-espresso-app",
            "summary": "Upload an app",
            "description": "Upload the application under test (AUT) for Espresso testing.",
            "section": "Espresso Apps",
            "fields": [
              {
                "name": "custom_id",
                "label": "Custom Id",
                "description": "Custom ID for the app. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "file",
                "label": "File",
                "description": "Path to the app file on your machine. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "file",
                "required": false,
                "location": "body"
              },
              {
                "name": "url",
                "label": "Url",
                "description": "URL of the app file. Ensure that its a publicly accessible URL as BrowserStack will attempt to download the app from this location. Supported file formats are .apk and .aab files for Android and .ipa file for iOS",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-apps-by-custom-id",
            "summary": "Fetches list of uploaded apps by custom ID",
            "description": "Fetches list of uploaded apps by custom ID",
            "section": "Apps",
            "fields": [
              {
                "name": "customId",
                "label": "CustomId",
                "description": "Custom ID of your app",
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
            "section": "Flutter Android Apps",
            "fields": [
              {
                "name": "scope",
                "label": "Scope",
                "description": "Show recent apps at a group level or user level.",
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
                "description": "Filter recently uploaded apps by custom ID. Accepted characters are A-Z, a-z, 0-9, ., -, _. All other characters are ignored. Character limit is 100.",
                "type": "string",
                "required": false,
                "location": "query"
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "Number of recent apps to be fetched. Default is 10.",
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
            "section": "Session Logs",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Apps",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "ID of your build",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "sessionId",
                "label": "SessionId",
                "description": "ID of your session",
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
            "section": "Builds",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": false,
                "location": "query",
                "picker": {
                  "source": "app-automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "limit",
                "label": "Limit",
                "description": "Specify the number of results to be displayed. The default value is 10, and the maximum value is 100",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "offset",
                "label": "Offset",
                "description": "Retrieve builds from a specific point using the offset parameter",
                "type": "number",
                "required": false,
                "location": "query"
              },
              {
                "name": "status",
                "label": "Status",
                "description": "Status of the build",
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
            "section": "Flutter iOS Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "Test package ID of your app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "delete-flutter-ios-app",
            "summary": "Delete a Flutter iOS test package that was previously uploaded to BrowserStack",
            "description": "Delete a Flutter iOS test package that was previously uploaded to BrowserStack. Note that apps once deleted cannot be recovered.",
            "section": "Flutter iOS Apps",
            "fields": [
              {
                "name": "appId",
                "label": "AppId",
                "description": "Test package ID of your app",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-apps",
                  "valueField": "app_url",
                  "labelFields": [
                    "app_url",
                    "app_name"
                  ]
                }
              }
            ]
          },
          {
            "id": "get-project-badge-key",
            "summary": "Fetches the badge key for the project",
            "description": "Fetches the badge key for sharing a public link for the Automate dashboard to view the latest build and sessions for that project",
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "ID of your project",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "app-automate.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Jobs",
            "fields": [
              {
                "name": "jobId",
                "label": "JobId",
                "description": "ID of your screenshot job",
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
            "section": "Jobs",
            "fields": [
              {
                "name": "browsers",
                "label": "Browsers",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "orientation",
                "label": "Orientation",
                "description": "Screen orientation for a mobile device. Default: portrait",
                "type": "string",
                "required": false,
                "location": "body",
                "enum": [
                  "portrait",
                  "landscape"
                ]
              },
              {
                "name": "url",
                "label": "Url",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "callback_url",
                "label": "Callback Url",
                "description": "Public URL to which the screenshot will be posted.",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "win_res",
                "label": "Win Res",
                "description": "Sceen resolution of the Windows machine. Values: 1024x768, 1280x1024. Default: 1024x768",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "mac_res",
                "label": "Mac Res",
                "description": "Sceen resolution of the Mac machine. Values: 1024x768, 1280x960, 1280x1024, 1600x1200, 1920x1080. Default: 1024x768",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "quality",
                "label": "Quality",
                "description": "Quality of the screenshot. Default: Compressed",
                "type": "string",
                "required": false,
                "location": "body",
                "enum": [
                  "Compressed",
                  "Original"
                ]
              },
              {
                "name": "local",
                "label": "Local",
                "description": "Set to true if URL is local and a Local Testing connection has been set up. Default: false",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "wait_time",
                "label": "Wait Time",
                "description": "Time in seconds to wait before taking the screenshot. Default: 5",
                "type": "number",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-browsers",
            "summary": "Fetches list of browsers",
            "description": "Fetches list of browsers supported by Screenshots API",
            "section": "Browsers",
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
            "section": "Instances",
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
            "section": "Instances",
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
            "section": "Instances",
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
            "section": "Projects",
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
            "section": "Projects",
            "fields": [
              {
                "name": "project.name",
                "label": "Project › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "project.description",
                "label": "Project › Description",
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
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-project",
            "summary": "Update a project",
            "description": "",
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "project.name",
                "label": "Project › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "project.description",
                "label": "Project › Description",
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
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Folders",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Folders",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "folder.name",
                "label": "Folder › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "folder.description",
                "label": "Folder › Description",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "folder.parent_id",
                "label": "Folder › Parent Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-folder",
            "summary": "Get folder details",
            "description": "",
            "section": "Folders",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-folders",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-folder",
            "summary": "Update a folder",
            "description": "",
            "section": "Folders",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-folders",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "folder.name",
                "label": "Folder › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "folder.description",
                "label": "Folder › Description",
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
            "section": "Folders",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-folders",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "move-folder",
            "summary": "Move a folder",
            "description": "",
            "section": "Folders",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-folders",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Cases",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
                "location": "query",
                "picker": {
                  "source": "test-management.list-folders",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Cases (Bulk)",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
                "name": "test_case.preconditions",
                "label": "Test Case › Preconditions",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.owner",
                "label": "Test Case › Owner",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.tags",
                "label": "Test Case › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.custom_fields",
                "label": "Test Case › Custom Fields",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.automation_status",
                "label": "Test Case › Automation Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.case_type",
                "label": "Test Case › Case Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.priority",
                "label": "Test Case › Priority",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.status",
                "label": "Test Case › Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "bulk-delete-test-cases",
            "summary": "Bulk delete test cases",
            "description": "",
            "section": "Test Cases (Bulk)",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Test Cases (Bulk)",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Test Cases (Bulk)",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Test Cases (Bulk)",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Test Cases",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "folderId",
                "label": "FolderId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-folders",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "test_case.name",
                "label": "Test Case › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.template",
                "label": "Test Case › Template",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.description",
                "label": "Test Case › Description",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.owner",
                "label": "Test Case › Owner",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.preconditions",
                "label": "Test Case › Preconditions",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.test_case_steps",
                "label": "Test Case › Test Case Steps",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.issues",
                "label": "Test Case › Issues",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.issue_tracker.name",
                "label": "Test Case › Issue Tracker › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.issue_tracker.host",
                "label": "Test Case › Issue Tracker › Host",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.tags",
                "label": "Test Case › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.case_type",
                "label": "Test Case › Case Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.priority",
                "label": "Test Case › Priority",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.custom_fields",
                "label": "Test Case › Custom Fields",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.feature",
                "label": "Test Case › Feature",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.scenario",
                "label": "Test Case › Scenario",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.background",
                "label": "Test Case › Background",
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
            "section": "Test Cases",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "test_case.name",
                "label": "Test Case › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.case_type",
                "label": "Test Case › Case Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.priority",
                "label": "Test Case › Priority",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.status",
                "label": "Test Case › Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.description",
                "label": "Test Case › Description",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.owner",
                "label": "Test Case › Owner",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.preconditions",
                "label": "Test Case › Preconditions",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.test_case_steps",
                "label": "Test Case › Test Case Steps",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.issues",
                "label": "Test Case › Issues",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.issue_tracker.name",
                "label": "Test Case › Issue Tracker › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.issue_tracker.host",
                "label": "Test Case › Issue Tracker › Host",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.tags",
                "label": "Test Case › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.custom_fields",
                "label": "Test Case › Custom Fields",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.automation_status",
                "label": "Test Case › Automation Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.feature",
                "label": "Test Case › Feature",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.scenario",
                "label": "Test Case › Scenario",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case.background",
                "label": "Test Case › Background",
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
            "section": "Test Cases",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "archive-test-case",
            "summary": "Archive a test case",
            "description": "",
            "section": "Test Cases",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "unarchive-test-case",
            "summary": "Unarchive a test case",
            "description": "",
            "section": "Test Cases",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "move-test-case",
            "summary": "Move a test case to a different folder",
            "description": "",
            "section": "Test Cases",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Case Attachments",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Case Attachments",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "inline",
                "label": "Inline",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "query"
              },
              {
                "name": "file",
                "label": "File",
                "description": "",
                "type": "file",
                "required": true,
                "location": "body"
              },
              {
                "name": "file_name",
                "label": "File Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-test-case-attachment",
            "summary": "Delete attachment from a test case",
            "description": "",
            "section": "Test Case Attachments",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "attachmentId",
                "label": "AttachmentId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-case-attachments",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId",
                    "testCaseId"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-test-result-attachments",
            "summary": "Get attachments for a test result",
            "description": "",
            "section": "Test Result Attachments",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testResultId",
                "label": "TestResultId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-run-results",
                  "valueField": "id",
                  "labelFields": [
                    "id"
                  ],
                  "filterBy": [
                    "projectId",
                    "testRunId"
                  ]
                }
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
            "section": "Test Result Attachments",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testResultId",
                "label": "TestResultId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-run-results",
                  "valueField": "id",
                  "labelFields": [
                    "id"
                  ],
                  "filterBy": [
                    "projectId",
                    "testRunId"
                  ]
                }
              },
              {
                "name": "file",
                "label": "File",
                "description": "",
                "type": "file",
                "required": true,
                "location": "body"
              },
              {
                "name": "file_name",
                "label": "File Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "delete-test-result-attachment",
            "summary": "Delete attachment from a test result",
            "description": "",
            "section": "Test Result Attachments",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testResultId",
                "label": "TestResultId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-run-results",
                  "valueField": "id",
                  "labelFields": [
                    "id"
                  ],
                  "filterBy": [
                    "projectId",
                    "testRunId"
                  ]
                }
              },
              {
                "name": "attachmentId",
                "label": "AttachmentId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-case-attachments",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId",
                    "testCaseId"
                  ]
                }
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
            "section": "Test Cases",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Run Results",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Run Results",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "test_result.status",
                "label": "Test Result › Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_result.comment",
                "label": "Test Result › Comment",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_result.duration",
                "label": "Test Result › Duration",
                "description": "",
                "type": "number",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_result.issues",
                "label": "Test Result › Issues",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_result.issue_tracker.name",
                "label": "Test Result › Issue Tracker › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_result.issue_tracker.host",
                "label": "Test Result › Issue Tracker › Host",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_result.custom_fields",
                "label": "Test Result › Custom Fields",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_case_id",
                "label": "Test Case Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "configuration_id",
                "label": "Configuration Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "body"
              },
              {
                "name": "results",
                "label": "Results",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "list-test-run-test-case-results",
            "summary": "Get test results for a specific test case in a test run",
            "description": "",
            "section": "Test Run Results",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "testCaseId",
                "label": "TestCaseId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
                "location": "query",
                "picker": {
                  "source": "test-management.list-test-plans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "test_run.name",
                "label": "Test Run › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.description",
                "label": "Test Run › Description",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.run_state",
                "label": "Test Run › Run State",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.assignee",
                "label": "Test Run › Assignee",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.test_case_assignee",
                "label": "Test Run › Test Case Assignee",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.tags",
                "label": "Test Run › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.issues",
                "label": "Test Run › Issues",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.issue_tracker.name",
                "label": "Test Run › Issue Tracker › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.issue_tracker.host",
                "label": "Test Run › Issue Tracker › Host",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.test_plan_id",
                "label": "Test Run › Test Plan Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.configurations",
                "label": "Test Run › Configurations",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.configuration_map",
                "label": "Test Run › Configuration Map",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.test_cases",
                "label": "Test Run › Test Cases",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.folder_ids",
                "label": "Test Run › Folder Ids",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.include_all",
                "label": "Test Run › Include All",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.status",
                "label": "Test Run › Filter Test Cases › Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.priority",
                "label": "Test Run › Filter Test Cases › Priority",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.case_type",
                "label": "Test Run › Filter Test Cases › Case Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.owner",
                "label": "Test Run › Filter Test Cases › Owner",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.tags",
                "label": "Test Run › Filter Test Cases › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.custom_fields",
                "label": "Test Run › Filter Test Cases › Custom Fields",
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "test_run.name",
                "label": "Test Run › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.run_state",
                "label": "Test Run › Run State",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.tags",
                "label": "Test Run › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.configurations",
                "label": "Test Run › Configurations",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.configuration_map",
                "label": "Test Run › Configuration Map",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.status",
                "label": "Test Run › Filter Test Cases › Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.priority",
                "label": "Test Run › Filter Test Cases › Priority",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.case_type",
                "label": "Test Run › Filter Test Cases › Case Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.owner",
                "label": "Test Run › Filter Test Cases › Owner",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.tags",
                "label": "Test Run › Filter Test Cases › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.custom_fields",
                "label": "Test Run › Filter Test Cases › Custom Fields",
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "test_run.name",
                "label": "Test Run › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.description",
                "label": "Test Run › Description",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.run_state",
                "label": "Test Run › Run State",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.assignee",
                "label": "Test Run › Assignee",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.test_case_assignee",
                "label": "Test Run › Test Case Assignee",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.tags",
                "label": "Test Run › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.issues",
                "label": "Test Run › Issues",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.issue_tracker.name",
                "label": "Test Run › Issue Tracker › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.issue_tracker.host",
                "label": "Test Run › Issue Tracker › Host",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.test_plan_id",
                "label": "Test Run › Test Plan Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.configurations",
                "label": "Test Run › Configurations",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.configuration_map",
                "label": "Test Run › Configuration Map",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.test_cases",
                "label": "Test Run › Test Cases",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.folder_ids",
                "label": "Test Run › Folder Ids",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.include_all",
                "label": "Test Run › Include All",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.status",
                "label": "Test Run › Filter Test Cases › Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.priority",
                "label": "Test Run › Filter Test Cases › Priority",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.case_type",
                "label": "Test Run › Filter Test Cases › Case Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.owner",
                "label": "Test Run › Filter Test Cases › Owner",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.tags",
                "label": "Test Run › Filter Test Cases › Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_run.filter_test_cases.custom_fields",
                "label": "Test Run › Filter Test Cases › Custom Fields",
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "delete-test-run",
            "summary": "Delete a test run",
            "description": "",
            "section": "Test Runs",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testRunId",
                "label": "TestRunId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Test Plans",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Test Plans",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "test_plan.name",
                "label": "Test Plan › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_plan.plan_status",
                "label": "Test Plan › Plan Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_plan.description",
                "label": "Test Plan › Description",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_plan.start_date",
                "label": "Test Plan › Start Date",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_plan.end_date",
                "label": "Test Plan › End Date",
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
            "section": "Test Plans",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testPlanId",
                "label": "TestPlanId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-plans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-test-plan",
            "summary": "Update a test plan",
            "description": "",
            "section": "Test Plans",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testPlanId",
                "label": "TestPlanId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-plans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              },
              {
                "name": "test_plan.name",
                "label": "Test Plan › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_plan.plan_status",
                "label": "Test Plan › Plan Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_plan.description",
                "label": "Test Plan › Description",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_plan.start_date",
                "label": "Test Plan › Start Date",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "test_plan.end_date",
                "label": "Test Plan › End Date",
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
            "section": "Test Plans",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "testPlanId",
                "label": "TestPlanId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-test-plans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Configurations",
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
            "section": "Configurations",
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
            "section": "Configurations",
            "fields": [
              {
                "name": "configurationId",
                "label": "ConfigurationId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-configurations",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Custom Fields",
            "fields": []
          },
          {
            "id": "create-custom-field",
            "summary": "Create a custom field",
            "description": "",
            "section": "Custom Fields",
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
            "section": "Custom Fields",
            "fields": [
              {
                "name": "customFieldId",
                "label": "CustomFieldId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-custom-fields",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Custom Fields",
            "fields": [
              {
                "name": "customFieldId",
                "label": "CustomFieldId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-management.list-custom-fields",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Workflow Analyzer",
            "fields": []
          },
          {
            "id": "get-workflow-analyzer-report-summary",
            "summary": "Get Workflow Analyzer report summary",
            "description": "Returns the summary for a specific Workflow Analyzer report, including score, issue counts, and scan metadata.",
            "section": "Workflow Analyzer",
            "fields": [
              {
                "name": "report_id",
                "label": "Report Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-workflow-analyzer-reports",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-workflow-analyzer-report-issues",
            "summary": "Get Workflow Analyzer report issues",
            "description": "Returns the paginated list of accessibility issues for a specific Workflow Analyzer report, optionally filtered by task.",
            "section": "Workflow Analyzer",
            "fields": [
              {
                "name": "report_id",
                "label": "Report Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query",
                "picker": {
                  "source": "accessibility.list-workflow-analyzer-reports",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Assisted Tests",
            "fields": []
          },
          {
            "id": "get-assisted-test-report-summary",
            "summary": "Get Assisted Test report summary",
            "description": "Returns the summary for a specific Assisted Test report, including score, issue counts, and scan metadata.",
            "section": "Assisted Tests",
            "fields": [
              {
                "name": "report_id",
                "label": "Report Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-workflow-analyzer-reports",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-assisted-test-report-issues",
            "summary": "Get Assisted Test report issues",
            "description": "Returns the paginated list of accessibility issues for a specific Assisted Test report, optionally filtered by task.",
            "section": "Assisted Tests",
            "fields": [
              {
                "name": "report_id",
                "label": "Report Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query",
                "picker": {
                  "source": "accessibility.list-workflow-analyzer-reports",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Website Scanner Auth",
            "fields": []
          },
          {
            "id": "create-website-scanner-auth-config",
            "summary": "Create Website Scanner auth config",
            "description": "Creates a new authentication configuration for the Website Scanner to access login-protected pages during scans.",
            "section": "Website Scanner Auth",
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
                "name": "authData.url",
                "label": "AuthData › Url",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "authData.username",
                "label": "AuthData › Username",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "authData.password",
                "label": "AuthData › Password",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "authData.usernameSelector",
                "label": "AuthData › UsernameSelector",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "authData.passwordSelector",
                "label": "AuthData › PasswordSelector",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "authData.submitSelector",
                "label": "AuthData › SubmitSelector",
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
            "section": "Website Scanner Scans",
            "fields": []
          },
          {
            "id": "create-website-scanner-scan",
            "summary": "Create Website Scanner scan",
            "description": "Creates and triggers a new Website Scanner accessibility scan for the specified URL.",
            "section": "Website Scanner Scans",
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
            "section": "Website Scanner Scans",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-website-scanner-scan-runs",
            "summary": "List Website Scanner scan runs",
            "description": "Returns a paginated list of all scan runs for a specific Website Scanner scan, including status and issue counts.",
            "section": "Website Scanner Runs",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Website Scanner Runs",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "scan_run_id",
                "label": "Scan Run Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scan-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id"
                  ],
                  "filterBy": [
                    "scan_id"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-website-scanner-scan-run-status",
            "summary": "Get Website Scanner scan run status",
            "description": "Returns the current execution status of a specific Website Scanner scan run.",
            "section": "Website Scanner Runs",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "scan_run_id",
                "label": "Scan Run Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scan-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id"
                  ],
                  "filterBy": [
                    "scan_id"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-website-scanner-scan-run-issues",
            "summary": "Get Website Scanner scan run issues",
            "description": "Returns paginated accessibility issues found during a specific Website Scanner scan run, optionally filtered by task.",
            "section": "Website Scanner Runs",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "scan_run_id",
                "label": "Scan Run Id",
                "description": "",
                "type": "number",
                "required": false,
                "location": "query",
                "picker": {
                  "source": "accessibility.list-website-scanner-scan-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id"
                  ],
                  "filterBy": [
                    "scan_id"
                  ]
                }
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
            "section": "Website Scanner Runs",
            "fields": [
              {
                "name": "scan_id",
                "label": "Scan Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scans",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              },
              {
                "name": "scan_run_id",
                "label": "Scan Run Id",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "accessibility.list-website-scanner-scan-runs",
                  "valueField": "id",
                  "labelFields": [
                    "id"
                  ],
                  "filterBy": [
                    "scan_id"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-automated-test-projects",
            "summary": "List Automated Test projects",
            "description": "Returns a paginated list of all Automated Test accessibility projects for your account.",
            "section": "Automated Tests",
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
            "section": "Automated Tests",
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
                "location": "query",
                "picker": {
                  "source": "accessibility.list-automated-test-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "list-automated-test-build-test-cases",
            "summary": "List test cases for an Automated Test build",
            "description": "Returns the paginated list of test cases and their accessibility results for a specific Automated Test build.",
            "section": "Automated Tests",
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
            "section": "Automated Tests",
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
            "section": "Automated Tests",
            "fields": [
              {
                "name": "build_id",
                "label": "Build Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "query",
                "picker": {
                  "source": "accessibility.list-automated-test-builds",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Automated Tests",
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
                "location": "path",
                "picker": {
                  "source": "accessibility.list-automated-test-build-test-cases",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ],
                  "filterBy": [
                    "build_id"
                  ]
                }
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
            "section": "Automated Tests",
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
            "section": "Projects",
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
            "section": "Projects",
            "fields": [
              {
                "name": "projectId",
                "label": "ProjectId",
                "description": "",
                "type": "number",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "id",
                  "labelFields": [
                    "id",
                    "name"
                  ]
                }
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
            "section": "Builds",
            "fields": [
              {
                "name": "name",
                "label": "Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "project_name",
                "label": "Project Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "started_at",
                "label": "Started At",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "tags",
                "label": "Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "build_run_identifier",
                "label": "Build Run Identifier",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "host_info.hostname",
                "label": "Host Info › Hostname",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "host_info.platform",
                "label": "Host Info › Platform",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "host_info.type",
                "label": "Host Info › Type",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "host_info.version",
                "label": "Host Info › Version",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "host_info.arch",
                "label": "Host Info › Arch",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "ci_info.name",
                "label": "Ci Info › Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "ci_info.build_url",
                "label": "Ci Info › Build Url",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "ci_info.url",
                "label": "Ci Info › Url",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "ci_info.build_number",
                "label": "Ci Info › Build Number",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "ci_info.job_name",
                "label": "Ci Info › Job Name",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control",
                "label": "Version Control",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "framework.name",
                "label": "Framework › Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "framework.version",
                "label": "Framework › Version",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              }
            ]
          },
          {
            "id": "get-latest-build",
            "summary": "Get Latest Build",
            "description": "",
            "section": "Builds",
            "fields": [
              {
                "name": "project_name",
                "label": "Project Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "query",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "name",
                  "labelFields": [
                    "name"
                  ]
                }
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
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-build",
            "summary": "Update Build Metadata",
            "description": "",
            "section": "Builds",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Builds",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ]
                }
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ]
                }
              },
              {
                "name": "name",
                "label": "Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "file_name",
                "label": "File Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "scopes",
                "label": "Scopes",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "started_at",
                "label": "Started At",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "tags",
                "label": "Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "location",
                "label": "Location",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "result",
                "label": "Result",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "custom_metadata",
                "label": "Custom Metadata",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "environment",
                "label": "Environment",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "finish-test-run",
            "summary": "Finish Test Run (ingestion)",
            "description": "",
            "section": "Test Runs",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ]
                }
              },
              {
                "name": "testRunUuid",
                "label": "TestRunUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "result",
                "label": "Result",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body",
                "enum": [
                  "passed",
                  "failed",
                  "skipped",
                  "timeout"
                ]
              },
              {
                "name": "finished_at",
                "label": "Finished At",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "file_name",
                "label": "File Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "scopes",
                "label": "Scopes",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "duration_in_ms",
                "label": "Duration In Ms",
                "description": "",
                "type": "number",
                "required": false,
                "location": "body"
              },
              {
                "name": "failure",
                "label": "Failure",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "custom_metadata",
                "label": "Custom Metadata",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "environment",
                "label": "Environment",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "start-hook-run",
            "summary": "Start Hook Run (ingestion)",
            "description": "",
            "section": "Hook Runs",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ]
                }
              },
              {
                "name": "hook_type",
                "label": "Hook Type",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "name",
                "label": "Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "file_name",
                "label": "File Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "scopes",
                "label": "Scopes",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "started_at",
                "label": "Started At",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "test_run_id",
                "label": "Test Run Id",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "tags",
                "label": "Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "location",
                "label": "Location",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "custom_metadata",
                "label": "Custom Metadata",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "finish-hook-run",
            "summary": "Finish Hook Run (ingestion)",
            "description": "",
            "section": "Hook Runs",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ]
                }
              },
              {
                "name": "hookRunUuid",
                "label": "HookRunUuid",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path"
              },
              {
                "name": "hook_type",
                "label": "Hook Type",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "result",
                "label": "Result",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body",
                "enum": [
                  "passed",
                  "failed",
                  "skipped",
                  "timeout"
                ]
              },
              {
                "name": "finished_at",
                "label": "Finished At",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "file_name",
                "label": "File Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "scopes",
                "label": "Scopes",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "duration_in_ms",
                "label": "Duration In Ms",
                "description": "",
                "type": "number",
                "required": false,
                "location": "body"
              },
              {
                "name": "failure",
                "label": "Failure",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "custom_metadata",
                "label": "Custom Metadata",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "environment",
                "label": "Environment",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          },
          {
            "id": "add-build-logs",
            "summary": "Add Build Logs (ingestion)",
            "description": "",
            "section": "Builds",
            "fields": [
              {
                "name": "buildHashedId",
                "label": "BuildHashedId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ]
                }
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
            "section": "Test Runs",
            "fields": [
              {
                "name": "buildId",
                "label": "BuildId",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-project-builds",
                  "valueField": "hashed_id",
                  "labelFields": [
                    "hashed_id",
                    "name",
                    "status"
                  ],
                  "filterBy": [
                    "projectId"
                  ]
                }
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
            "section": "Reports",
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
            "section": "Quality Gate",
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
            "section": "Quality Gate",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "name",
                  "labelFields": [
                    "name"
                  ]
                }
              }
            ]
          },
          {
            "id": "update-quality-gate-settings",
            "summary": "Update Quality Gate Settings",
            "description": "",
            "section": "Quality Gate",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "name",
                  "labelFields": [
                    "name"
                  ]
                }
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
            "section": "Quality Gate Profiles",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "name",
                  "labelFields": [
                    "name"
                  ]
                }
              },
              {
                "name": "name",
                "label": "Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "enabled",
                "label": "Enabled",
                "description": "",
                "type": "boolean",
                "required": true,
                "location": "body"
              },
              {
                "name": "is_global_profile",
                "label": "Is Global Profile",
                "description": "",
                "type": "boolean",
                "required": true,
                "location": "body"
              },
              {
                "name": "rules",
                "label": "Rules",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "applicable_builds.all_builds",
                "label": "Applicable Builds › All Builds",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "applicable_builds.build_tags",
                "label": "Applicable Builds › Build Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "applicable_builds.build_names",
                "label": "Applicable Builds › Build Names",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "rule_status",
                "label": "Rule Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body",
                "enum": [
                  "pass",
                  "fail"
                ]
              },
              {
                "name": "hooks_visibility",
                "label": "Hooks Visibility",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body",
                "enum": [
                  "failed",
                  "none",
                  "beforeFailed",
                  "all"
                ]
              }
            ]
          },
          {
            "id": "get-quality-gate-profile",
            "summary": "Get Quality Gate Profile",
            "description": "",
            "section": "Quality Gate Profiles",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "name",
                  "labelFields": [
                    "name"
                  ]
                }
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
            "section": "Quality Gate Profiles",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "name",
                  "labelFields": [
                    "name"
                  ]
                }
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
                "name": "name",
                "label": "Name",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "enabled",
                "label": "Enabled",
                "description": "",
                "type": "boolean",
                "required": true,
                "location": "body"
              },
              {
                "name": "is_global_profile",
                "label": "Is Global Profile",
                "description": "",
                "type": "boolean",
                "required": true,
                "location": "body"
              },
              {
                "name": "rules",
                "label": "Rules",
                "description": "",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "applicable_builds.all_builds",
                "label": "Applicable Builds › All Builds",
                "description": "",
                "type": "boolean",
                "required": false,
                "location": "body"
              },
              {
                "name": "applicable_builds.build_tags",
                "label": "Applicable Builds › Build Tags",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "applicable_builds.build_names",
                "label": "Applicable Builds › Build Names",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "rule_status",
                "label": "Rule Status",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body",
                "enum": [
                  "pass",
                  "fail"
                ]
              },
              {
                "name": "hooks_visibility",
                "label": "Hooks Visibility",
                "description": "",
                "type": "string",
                "required": false,
                "location": "body",
                "enum": [
                  "failed",
                  "none",
                  "beforeFailed",
                  "all"
                ]
              }
            ]
          },
          {
            "id": "delete-quality-gate-profile",
            "summary": "Delete Quality Gate Profile",
            "description": "",
            "section": "Quality Gate Profiles",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "name",
                  "labelFields": [
                    "name"
                  ]
                }
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
            "section": "Quality Gate Profiles",
            "fields": [
              {
                "name": "projectName",
                "label": "ProjectName",
                "description": "",
                "type": "string",
                "required": true,
                "location": "path",
                "picker": {
                  "source": "test-reporting.list-projects",
                  "valueField": "name",
                  "labelFields": [
                    "name"
                  ]
                }
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
            "section": "Reports",
            "fields": [
              {
                "name": "file",
                "label": "File",
                "description": "JUnit XML file or zip archive containing multiple XML files (max 100 MB)",
                "type": "file",
                "required": true,
                "location": "body"
              },
              {
                "name": "file_name",
                "label": "File Name",
                "description": "Override the uploaded file's name",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "project_name",
                "label": "Project Name",
                "description": "Project name to associate this build with",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "build_name",
                "label": "Build Name",
                "description": "Build name for this test run",
                "type": "string",
                "required": true,
                "location": "body"
              },
              {
                "name": "format",
                "label": "Format",
                "description": "Report format",
                "type": "string",
                "required": false,
                "location": "body",
                "enum": [
                  "junit",
                  "allure"
                ]
              },
              {
                "name": "build_identifier",
                "label": "Build Identifier",
                "description": "Unique identifier to correlate split or re-run uploads (expires after 6 hours)",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "tags",
                "label": "Tags",
                "description": "Comma-separated tags (e.g. 'regression, nightly')",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "ci",
                "label": "Ci",
                "description": "CI job URL (e.g. 'https://ci.example.com/builds/42')",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "framework_version",
                "label": "Framework Version",
                "description": "Framework name and version (e.g. 'junit, 5.8')",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.sha",
                "label": "Version Control › Sha",
                "description": "Commit SHA",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.short_sha",
                "label": "Version Control › Short Sha",
                "description": "Short commit SHA",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.branch",
                "label": "Version Control › Branch",
                "description": "Branch name",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.tag",
                "label": "Version Control › Tag",
                "description": "Git tag",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.commit_message",
                "label": "Version Control › Commit Message",
                "description": "Commit message",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.committer_name",
                "label": "Version Control › Committer Name",
                "description": "Committer name",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.committer_email",
                "label": "Version Control › Committer Email",
                "description": "Committer email",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.author_name",
                "label": "Version Control › Author Name",
                "description": "Author name",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.author_email",
                "label": "Version Control › Author Email",
                "description": "Author email",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.committed_at",
                "label": "Version Control › Committed At",
                "description": "Commit timestamp",
                "type": "string",
                "required": false,
                "location": "body"
              },
              {
                "name": "version_control.remote_url",
                "label": "Version Control › Remote Url",
                "description": "Remote repository URL",
                "type": "string",
                "required": false,
                "location": "body"
              }
            ]
          }
        ]
      }
    ]
  }
];
