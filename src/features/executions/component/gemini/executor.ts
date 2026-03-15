import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { geminiChannel } from "@/inngest/channels/gemini";

type GeminiModel =
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite"
  | "gemini-1.5-flash"
  | "gemini-1.5-flash-8b"
  | "gemini-1.5-pro";

type GeminiNodeData = {
  variableName: string;
  model: GeminiModel;
  systemPrompt?: string;
  userPrompt: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

export const geminiExecutor: NodeExecutor<GeminiNodeData> = async ({
  data,
  step,
  nodeId,
  context,
  publish,
}) => {
  await publish(
    geminiChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  // ── Validation ──────────────────────────────────────────────────────────

  if (!data.variableName) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini node: Variable name not configured");
  }

  if (!data.model) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini node: Model not configured");
  }

  if (!data.userPrompt) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("Gemini node: User prompt not configured");
  }

  const credentialValue = process.env.GEMINI_API_KEY;
  if (!credentialValue) {
    await publish(geminiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError(
      "Gemini node: GEMINI_API_KEY is not set in environment variables",
    );
  }

  // ── Execution ────────────────────────────────────────────────────────────

  const google = createGoogleGenerativeAI({
    apiKey: credentialValue,
  });

  try {
    const { text, finishReason, usage } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google(data.model ?? "gemini-2.0-flash"),
        system: data.systemPrompt
          ? Handlebars.compile(data.systemPrompt)(context)
          : undefined,
        prompt: Handlebars.compile(data.userPrompt)(context),
      },
    );

    await publish(
      geminiChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...(context ?? {}),
      [data.variableName]: {
        geminiResponse: {
          text,
          model: data.model,
          finishReason,
          usage,
        },
      },
    };
  } catch (error) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
