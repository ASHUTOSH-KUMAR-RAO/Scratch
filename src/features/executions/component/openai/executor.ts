// executor.ts — Fully Updated & Fixed Gemini Executor

import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import { openAiChannel } from "@/inngest/channels/openai";

// Valid & stable Gemini model list
export type OpenAiModel = "gpt-5.3";
("gpt-5.3-mini");
("gpt-5.2");
("gpt-5.1");
("gpt-4.1");
("gpt-4.1-mini");

export type OpenAiNodeData = {
  variableName: string;
  model: OpenAiModel;
  systemPrompt?: string;
  userPrompt: string;
};

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(stringified);
});

export const OpenAiExecutor: NodeExecutor<OpenAiNodeData> = async ({
  data,
  step,
  nodeId,
  context,
  publish,
}) => {
  await publish(openAiChannel().status({ nodeId, status: "loading" }));

  // Validation
  if (!data.variableName) {
    await publish(openAiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OpenAi Node: Variable name not configured");
  }

  if (!data.model) {
    await publish(openAiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OpenAi Node: Model not configured");
  }

  if (!data.userPrompt) {
    await publish(openAiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("OpenAi Node: User prompt not configured");
  }

  const credentialValue = process.env.GEMINI_API_KEY;
  if (!credentialValue) {
    await publish(openAiChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError(
      "OpenAi Node: OPENAI_API_KEY is not set in environment variables",
    );
  }

  // Initialize Google API
  const openAI = createOpenAI({ apiKey: credentialValue });

  try {
    // Create model instance — auto schema switching
    const modelInstance = openAI(data.model);

    const compiledSystem = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : undefined;

    const compiledUser = Handlebars.compile(data.userPrompt)(context);

    const { text, finishReason, usage } = await step.ai.wrap(
      "openAi-generate-text",
      generateText,
      {
        model: modelInstance as unknown as LanguageModel,
        system: compiledSystem,
        prompt: compiledUser,
      },
    );

    await publish(openAiChannel().status({ nodeId, status: "success" }));

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
    await publish(openAiChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
