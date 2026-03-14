"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { StripeTriggerDialog } from "./dialog";
import { fetchStripeTriggerRealtimeToken } from "./actions";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

const nodeStatus = useNodeStatus({
    nodeId:props.id,
    channel:stripeTriggerChannel().name,
    topic:"status",
    refreshToken:fetchStripeTriggerRealtimeToken
  });
  const handleOpenSettings = () => {
    setDialogOpen(true);
  };
  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logo/stripe.svg"
        status={nodeStatus}
        name="Stripe"
        description="When stripe event is capture"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";
