import {
  ExecuteOptions,
  BrowserStackOptions,
} from "@dot-slash/browserstack-core";
import { BrowserStackError, OpenAPIError } from "@dot-slash/browserstack-core";
import type { components, operations } from "@dot-slash/browserstack-openapi/screenshots";
import { GeneratedScreenshotsClient } from "@dot-slash/browserstack-openapi/screenshots/client";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";

type ScreenshotsJobCC = DeepCamelCase<operations["createScreenshotsJob"]["responses"][200]["content"]["application/json"]>;
type GetJobCC = DeepCamelCase<operations["getScreenshotsJob"]["responses"][200]["content"]["application/json"]>;
type CreateJobBody = DeepCamelCase<operations["createScreenshotsJob"]["requestBody"]["content"]["application/json"]>;

export class ScreenshotsClient extends GeneratedScreenshotsClient {
  private static readonly jobCompleteStates = ["done", "error"];

  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://www.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@dot-slash/browserstack-screenshots",
      __PKG_VERSION__
    );
  }

  createJob(
    body: CreateJobBody,
    options?: ExecuteOptions
  ): Promise<ScreenshotsJobCC & { id: string }> {
    return super.createJob(body, options).then((job) => ({
      ...job,
      id: job.jobId!,
    }));
  }

  getJob(
    jobId: string,
    options?: ExecuteOptions
  ): Promise<GetJobCC & { id: string }> {
    return super.getJob(jobId, options).then((job) => ({
      ...job,
      id: job.id ?? job.jobId ?? jobId,
    }));
  }

  trackJob(
    jobId: string,
    onScreenshot?: (
      screenshot: DeepCamelCase<components["schemas"]["Screenshot"]>
    ) => void | Promise<void>,
    options?: ExecuteOptions,
    pollInterval = 10_000
  ): Promise<DeepCamelCase<components["schemas"]["Screenshot"]>[]> {
    return new Promise((resolve, reject) => {
      const result: Map<string, DeepCamelCase<components["schemas"]["Screenshot"]>> = new Map();
      let abortController: AbortController | undefined;

      const end = (err?: Error) => {
        clearInterval(interval);
        abortController?.abort?.();

        if (err) {
          reject(
            err instanceof BrowserStackError || err instanceof OpenAPIError
              ? err
              : new BrowserStackError(err.message, err)
          );
        } else {
          resolve(Array.from(result.values()));
        }
      };

      const interval = setInterval(async () => {
        abortController = options?.signal ? undefined : new AbortController();
        const signal = options?.signal ?? abortController?.signal;

        const job = await this.getJob(jobId, { signal }).catch(end);

        if (!job) return;

        const screenshots = job.screenshots ?? [];

        for (const screenshot of screenshots) {
          if (ScreenshotsClient.jobCompleteStates.includes(screenshot.state)) {
            if (!result.has(screenshot.id)) {
              result.set(screenshot.id, screenshot);
            }
            await onScreenshot?.(screenshot);
          }
        }

        if (job.state === "done" || screenshots.length === result.size) {
          end();
        }
      }, pollInterval);
    });
  }

  async launch(
    body: CreateJobBody,
    onScreenshot?: (
      screenshot: DeepCamelCase<components["schemas"]["Screenshot"]>
    ) => void | Promise<void>,
    options?: ExecuteOptions & {
      pollInterval?: number;
    }
  ) {
    const { pollInterval, ...createJobOptions } = options ?? {};
    const { id } = await this.createJob(body, createJobOptions);
    return this.trackJob(id, onScreenshot, undefined, pollInterval);
  }
}
