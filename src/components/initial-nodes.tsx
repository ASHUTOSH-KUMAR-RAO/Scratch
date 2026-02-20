// initial-node.tsx - UPDATED with name and description
"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

/**
 * InitialNode - Starting point of the workflow
 * Yeh node workflow ka pehla node hai jahan se user apna flow start karta hai
 */
export const InitialNode = memo((props: NodeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);


  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode
        name="Initial Node"
        description="Click to add a node"
        showToolbar={false}
      >
        <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
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
    </NodeSelector>
  );
});

// Display name for better debugging in React DevTools
InitialNode.displayName = "InitialNode";
