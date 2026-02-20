"use client";

import { createId } from "@paralleldrive/cuid2";
import { NodeType } from "@prisma/client";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import React, { useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger Manually",
    description:
      "Runs the flow by clicking a button. Good for getting started quickly.",
    icon: MousePointerIcon,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP Request",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const NodeSelector = ({
  children,
  onOpenChange,
  open,
}: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (nodeType: NodeTypeOption) => {
      // 🔴 Fix 1: Added return after toast so node doesn't get added
      if (nodeType.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );
        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL,
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: nodeType.type,
        };

        // 🔴 Fix 2: Filter out only INITIAL node, keep all other nodes intact
        if (hasInitialTrigger) {
          return [
            ...nodes.filter((node) => node.type !== NodeType.INITIAL),
            newNode,
          ];
        }

        return [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition],
  );

  const renderNodeOption = (nodeType: NodeTypeOption) => {
    const Icon = nodeType.icon;
    return (
      <div
        className="w-full flex items-start gap-4 p-4 rounded-lg cursor-pointer border border-transparent hover:border-primary hover:bg-accent/50 transition-all duration-200"
        key={nodeType.type}
        onClick={() => handleNodeSelect(nodeType)}
      >
        <div className="flex-shrink-0 rounded-md bg-primary/10 p-2">
          {typeof Icon === "string" ? (
            <img
              src={Icon}
              alt={nodeType.label}
              className="size-5 object-contain"
            />
          ) : (
            <Icon className="size-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm mb-1">{nodeType.label}</h3>
          <p className="text-xs text-muted-foreground">
            {nodeType.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>

        {/* Trigger Nodes */}
        <div className="mt-6 space-y-2">
          {triggerNodes.map(renderNodeOption)}
        </div>

        <Separator className="my-4" />

        {/* Execution / Action Nodes */}
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Actions
        </p>
        <div className="space-y-2">{executionNodes.map(renderNodeOption)}</div>
      </SheetContent>
    </Sheet>
  );
};
