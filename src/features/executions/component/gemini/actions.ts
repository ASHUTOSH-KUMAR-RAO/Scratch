"use server";

import { geminiChannel } from "@/inngest/channels/gemini";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type GeminiRealtimeToken = Realtime.Token<
  typeof geminiChannel,
  ["status"]
>;

export async function fetchGeminiRealtimeToken(): Promise<GeminiRealtimeToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: geminiChannel(),
    topics: ["status"],
  });
  return token;
}
