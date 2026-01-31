import {
  WorkflowsContainer,
  WorkflowsList,
} from "@/features/workflow/components/workflows";
import { workflowsParamsLoader } from "@/features/workflow/server/params-loader";
import { prefetchWorkflows } from "@/features/workflow/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
  const params = await workflowsParamsLoader(searchParams);
  await requireAuth();
  prefetchWorkflows(params);
  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary
          fallback={<div>Something went wrong loading workflows.</div>}
        >
          {/*  Basically the main purpose of this page is to host the WorkflowsList
        component and also we know that the the main purpose of Suspense is to
        handle loading states for components that are rendering asynchronously */}

          {/*  And Also HydrateClient is used to rehydrate the client-side state
        with the server-side fetched data, ensuring that the WorkflowsList
        component has access to the necessary data when it renders on the client
        side. */}
          <Suspense fallback={<div>Loading workflows...</div>}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
};

export default Page;
