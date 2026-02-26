"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HttpRequestDialog } from "./dialog";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Basically ye ek dialog hai jaab hum http node per click karenge then ye open hoga
type HttpRequestNodeData = {
  endpoint?: string;
  method?: HttpMethod;
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"} :${nodeData.endpoint}`
    : "Not Configured";

  const nodeStatus = "initial";

  const handleSubmit = (values: {
    endpoint: string;
    method: string;
    body?: string;
  }) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values
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
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={(open) => setDialogOpen(open)}
        onSubmit={handleSubmit}
        defaultEndPoint={nodeData.endpoint}
        defaultMethod={nodeData.method}
        defaultBody={nodeData.body}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        status={nodeStatus}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
