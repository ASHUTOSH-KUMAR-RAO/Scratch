import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions, HTTPError } from "ky";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  step,
  nodeId,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }
  if (!data.variableName) {
    throw new NonRetriableError("Variable Name not configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: KyOptions = {
      method,
      throwHttpErrors: false, // ky won't throw on 4xx/5xx
    };

    if (["POST", "PATCH", "PUT"].includes(method) && data.body) {
      options.body = data.body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    let response: Awaited<ReturnType<typeof ky>>;

    try {
      response = await ky(endpoint, options);
    } catch (err) {
      // Network errors, DNS failures, CORS, etc.
      throw new NonRetriableError(
        `HTTP Request failed (network error): ${(err as Error).message}`,
      );
    }

    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }
    return {
      ...context,
      ...responsePayload,
    };
  });

  return result;
};
