import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.workflows.getMany>;

// Prefetch for all workflows

export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Prefetch of single workflow :-
 */

export const prefetchWorkflow = (id: string) => {
  return  prefetch(trpc.workflows.getOne.queryOptions({ id }));
};
