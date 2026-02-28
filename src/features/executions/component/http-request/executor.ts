import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";

import ky, { type Options as KyOptions } from "ky";
type HttpRequestData = {
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
    // Publish Error State

    throw new NonRetriableError("HTTP Request node:No endpoint configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: KyOptions = { method }; // Basically pta hai ky hai n ye bhi ek fetching library hai like axios ki jaise hai bass differ ye hai ki ky bahut hi jyada light weight hota hai

    if (["POST", "PATCH", "PUT"].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  return result;

 
};
