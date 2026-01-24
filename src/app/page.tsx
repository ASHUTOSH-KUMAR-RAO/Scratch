"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflow.queryOptions());
  const queryClient = useQueryClient();

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.getWorkflow.queryOptions());
      },
    }),
  );

  const testAi = useMutation(trpc.testAi.mutationOptions());
  return (
    <div className="min-h-screen flex items-center justify-center gap-6 flex-col">
      <div>{JSON.stringify(data, null, 2)}</div>
      <Button onClick={()=>testAi.mutate()} disabled={testAi.isPending}>Test Ai</Button>
      <Button onClick={() => create.mutate()} disabled={create.isPending}>
        Create Wordflow
      </Button>
    </div>
  );
};

export default Page;
