"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo, type ReactNode } from "react";
import Image from "next/image";
import { WorkflowNode } from "@/components/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description: string;
  children?: ReactNode;
  // status?: NodeStatus;
  onCancel?: () => void;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    onCancel,
    onDoubleClick,
    onSettings,
  }: BaseExecutionNodeProps) => {
        const { setNodes, setEdges } = useReactFlow();

   const handleDelete = () => {
     setNodes((currentNodes) => {
       const updatedNode = currentNodes.filter((node) => node.id !== id);
       return updatedNode;
     });
     setEdges((currentEdges) => {
       const updatedEdges = currentEdges.filter(
         (edge) => edge.source !== id && edge.target !== id,
       );
       return updatedEdges;
     });
   };
    return (
      <WorkflowNode
        name={name}
        onDelete={handleDelete}
        onSettings={onSettings}
        description={description}
      >
        <BaseNode onDoubleClick={onDoubleClick}>
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} height={16} width={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle id="target-1" type="target" position={Position.Left} />
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    );
  },
);

BaseExecutionNode.displayName = "BaseExecutionNode";
