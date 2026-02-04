"use client";

import { ErrorViews, LoadingViews } from "@/components/entety-views";
import { useSuspenseWorkflow } from "@/features/workflow/hooks/use-workflows";

export const EditorLoading = () => {
  return <LoadingViews message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorViews message="Failed to load Editor.." />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  // Properly render your workflow data here
  return (
    <div>
      {/* Yahan actual editor UI implement karo */}
      <pre>{JSON.stringify(workflow, null, 2)}</pre>
    </div>
  );
};
