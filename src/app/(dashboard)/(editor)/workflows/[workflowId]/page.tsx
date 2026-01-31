import { requireAuth } from "@/lib/auth-utils";

const Page = async ({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) => {
  const { workflowId } = await params;
  await requireAuth();
  return <div> Workflow Id : {workflowId} </div>;
};

export default Page;
