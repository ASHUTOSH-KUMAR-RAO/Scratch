"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GeminiDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchGeminiRealtimeToken } from "./actions";
import { geminiChannel } from "@/inngest/channels/gemini";

type GeminiModel =
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite"
  | "gemini-1.5-flash"
  | "gemini-1.5-flash-8b"
  | "gemini-1.5-pro";

type GeminiNodeData = {
  variableName?: string;
  model?: GeminiModel;
  userPrompt?: string;
  systemPrompt?: string;
  [key: string]: unknown;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeData = props.data as GeminiNodeData;
  const description = nodeData.variableName
    ? `${nodeData.variableName} • ${nodeData.model ?? "gemini-2.0-flash"}`
    : "Not Configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: geminiChannel().name,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
  });

  const handleSubmit = (values: {
    variableName: string;
    model: GeminiModel;
    userPrompt: string;
    systemPrompt?: string;
  }) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={(open) => setDialogOpen(open)}
        onSubmit={handleSubmit}
        defaultValues={{
          variableName: nodeData.variableName,
          model: nodeData.model,
          userPrompt: nodeData.userPrompt,
          systemPrompt: nodeData.systemPrompt,
        }}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/logo/gemini.svg"
        name="Gemini"
        description={description}
        status={nodeStatus}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
