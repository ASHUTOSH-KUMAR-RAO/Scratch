"use client";

import { openAiChannel } from "@/inngest/channels/openai";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenAiDialog } from "./dialog";
import { fetchOpenAiRealtimeToken } from "./actions";

type OpenAiModel =
  | "gpt-5.3"
  | "gpt-5.3-mini"
  | "gpt-5.2"
  | "gpt-5.1"
  | "gpt-4.1"
  | "gpt-4.1-mini";

type OpenAiNodeData = {
  variableName?: string;
  model?: OpenAiModel;
  userPrompt?: string;
  systemPrompt?: string;
  [key: string]: unknown;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeData = props.data as OpenAiNodeData;
  const description = nodeData.variableName
    ? `${nodeData.variableName} • ${nodeData.model ?? "gemini-2.0-flash"}`
    : "Not Configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: openAiChannel().name,
    topic: "status",
    refreshToken: fetchOpenAiRealtimeToken,
  });

  const handleSubmit = (values: {
    variableName: string;
    model: OpenAiModel;
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
      <OpenAiDialog
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
        icon="/logo/openai.svg"
        name="OpenAi"
        description={description}
        status={nodeStatus}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
      />
    </>
  );
});

OpenAiNode.displayName = "OpenAiNode";
