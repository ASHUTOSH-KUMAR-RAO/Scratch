import { credentialParamsLoader } from "@/features/credentials/servers/params-loader";
import { prefetchCredentials } from "@/features/credentials/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
  await requireAuth();
  const params = await credentialParamsLoader(searchParams);
  prefetchCredentials(params);
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error</p>}></ErrorBoundary>
      <Suspense fallback={<p>Loading...</p>}>
        <p>Future:Credential List</p>
      </Suspense>
    </HydrateClient>
  );
};
export default Page;
