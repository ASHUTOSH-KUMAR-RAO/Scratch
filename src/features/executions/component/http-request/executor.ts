import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

Handlebars.registerHelper("json", (context) =>
{
  const stringified = JSON.stringify(context,null,2)
  return new Handlebars.SafeString(stringified)
}
);
export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  step,
  nodeId,
  context,
}) => {
  // ✅ Validation checks (same as before)
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: No endpoint configured");
  }
  if (!data.variableName) {
    throw new NonRetriableError(
      "HTTP Request node: Variable Name not configured",
    );
  }
  if (!data.method) {
    throw new NonRetriableError("HTTP Request node: Method not configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method;

    const options: KyOptions = {
      method,
      throwHttpErrors: false,
    };

    // ✅ Fix 4: Body ko JSON.parse + JSON.stringify se validate kar rahe hain
    if (["POST", "PATCH", "PUT"].includes(method) && data.body) {
      try {
        const resolved = Handlebars.compile(data.body)(context)
        JSON.parse(resolved)
        options.body = resolved;
      } catch {
        throw new NonRetriableError(
          "HTTP Request node: Body is not valid JSON",
        );
      }
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

    // ✅ Fix 2: HTTP 4xx/5xx errors explicitly handle kar rahe hain
    if (!response.ok) {
      throw new NonRetriableError(
        `HTTP Request failed: ${response.status} ${response.statusText}`,
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

    // ✅ Fix 1 & 3: Redundant if hata diya, context safely spread kar rahe hain
    return {
      ...(context ?? {}),
      [data.variableName]: responsePayload,
    };
  });

  // ✅ result kabhi undefined nahi hoga ab
  return result;
};
