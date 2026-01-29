import {
  WorkflowsContainer,
  WorkflowsList,
} from "@/features/workflow/components/workflows";
import { prefetchWorkflows } from "@/features/workflow/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
const Page = async () => {
  await requireAuth();
  prefetchWorkflows();
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
