import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { inngest } from "./client";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps:geminiSteps } = await step.ai.wrap(
      "Gemini -Generate-Text",
      generateText,
      {
        system:
          "You are a helpful assistant that helps users by generating text based on their input.",
        prompt: "What is the capital of France?",
        model: google("gemini-2.5-flash"),
      },
    );
    return geminiSteps
  },
);
