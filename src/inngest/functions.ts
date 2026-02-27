import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@prisma/client";
import { getExecutor } from "@/features/executions/component/lib/executor-registery";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Missing workflowId in event data");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });
      //! Topologically sort the nodes based on connections ,Basically Topological sort is used to order the nodes in a directed acyclic graph (DAG) based on their dependencies. In the context of a workflow, it ensures that each node is executed only after all of its dependencies (connected nodes) have been executed. This is crucial for maintaining the correct execution order and ensuring that data flows properly through the workflow.
      return topologicalSort(workflow.nodes, workflow.connections);
    });

    // Initialize the context with any initial data from the trigger event

    let context = event.data.initialData || {};

    // Execute Each Node Here :-

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
      });
    }
    return {
      workflowId,
      result: context,
    };
  },
);
