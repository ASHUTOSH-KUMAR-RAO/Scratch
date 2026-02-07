// workflow-node.tsx - FIXED VERSION
"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) {
  return (
    <div className="relative">
      {" "}
      {/* ✅ Fragment ki jagah div */}
      {/* Top Toolbar */}
      {showToolbar &&
        (onDelete || onSettings) && ( // ✅ Conditional check
          <NodeToolbar position={Position.Top} className="flex gap-3">
            {onSettings && (
              <Button
                variant="outline"
                size="icon"
                onClick={onSettings}
                className="h-8 w-8"
                aria-label="Node settings"
              >
                <SettingsIcon size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8"
                aria-label="Delete node"
              >
                <TrashIcon size={16} />
              </Button>
            )}
          </NodeToolbar>
        )}
      {/* Children content */}
      {children}
      {/* Bottom Name/Description */}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          className="max-w-[200px] text-center"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-muted-foreground truncate text-sm">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </div>
  );
}
