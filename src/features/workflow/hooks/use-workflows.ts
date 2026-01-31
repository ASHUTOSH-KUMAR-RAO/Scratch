/**
 * Hook to fetch all workflows.using suspense.,basically suspense means the data is fetched before the component is rendered to avoid loading states.
 */

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenceWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams()
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params)); // Using suspense to fetch workflows data
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(trpc.workflows.create.mutationOptions(
    {
      onSuccess:  (data) => {
        toast.success(`Workflow "${data.name}" created successfully!`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      }
    }
  ))}
