/**
 * Hook to fetch all credential.using suspense.,basically suspense means the data is fetched before the component is rendered to avoid loading states.
 */

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@prisma/client";

/**
 * Hook to fetch all credentials using suspense
 */
export const useSuspenceCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params)); // Using suspense to fetch workflows data
};

/**
 * Hook to create a new credentials
 */
export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credentials "${data.name}" created successfully!`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`);
      },
    }),
  );
};
/**
 * Hook for removing the credentials
 */

export const useRemoveCredentials = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Credentials removed successfully");
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      },
    }),
  );
};

/**
 * Hook to fetch a single credential using suspense
 */

export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

/**
 * Hook to update a credential
 */
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved successfully!`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save credential: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to Fetch credentials by type
 */

export const useCredentialsByType = (type:CredentialType)=>{
  const trpc = useTRPC()
  return useQuery(trpc.credentials.getByType.queryOptions({type}))
}
