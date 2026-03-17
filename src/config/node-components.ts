import { InitialNode } from "@/components/initial-nodes";
import { GeminiNode } from "@/features/executions/component/gemini/node";
import { HttpRequestNode } from "@/features/executions/component/http-request/node";
import { OpenAiNode } from "@/features/executions/component/openai/node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/node";
import { NodeType } from "@prisma/client";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]:StripeTriggerNode,
  [NodeType.GEMINI]:GeminiNode,
  [NodeType.OPENAI]:OpenAiNode
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
