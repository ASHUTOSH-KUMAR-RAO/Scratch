import { NodeExecutor } from "@/features/executions/types";

type HttpRequestData = Record<string, unknown>;
export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  context,
  step,
  nodeId,
}) => {
  const result = await step.run(
    `http-request-${nodeId}`,
    async () => context,
  );

  return result;
};
