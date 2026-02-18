// initial-node.tsx - UPDATED with name and description
"use client";

import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";

/**
 * InitialNode - Starting point of the workflow
 * Yeh node workflow ka pehla node hai jahan se user apna flow start karta hai
 */
export const InitialNode = memo((props: NodeProps) => {
  const handleAddNode = () => {
    console.log("Add node clicked");
    // TODO: Add your node creation logic here
  };

  const handleSettings = () => {
    console.log("Settings clicked");
    // TODO: Add settings logic
  };

  const handleDelete = () => {
    console.log("Delete clicked");
    // TODO: Add delete logic
  };

  return (
    <WorkflowNode
      name="Initial Node"
      description="Click to add a node"
      showToolbar={false}
      onSettings={handleSettings}
      onDelete={handleDelete}
    >
      <PlaceholderNode {...props} onClick={handleAddNode}>
        <div className="group cursor-pointer flex items-center justify-center">
          {/* Plus icon with hover effect */}
          <PlusIcon
            size={24}
            className="text-muted-foreground group-hover:text-primary transition-colors duration-200"
            strokeWidth={2}
          />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
});

// Display name for better debugging in React DevTools
InitialNode.displayName = "InitialNode";
