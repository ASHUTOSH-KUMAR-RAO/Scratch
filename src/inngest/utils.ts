import { Workflow } from "lucide-react";

import { Connection, Node } from "@prisma/client";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  // If there are no connections, return the nodes as is
  if (connections.length === 0) {
    return nodes;
  }

  // Create a edges array for toposort

  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  // Add nodes that are not in connections as edges to themselves to ensure they are included in the sort
  const connectedNodeIds = new Set<string>();

  for (const conn of connections) {
    connectedNodeIds.add(conn.fromNodeId);
    connectedNodeIds.add(conn.toNodeId);
  }
  // Add self-edges for nodes that are not connected to ensure they are included in the sort
  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // Perform topological sort

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    // Remove Duplicate (from self-edges)
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error(
        "Workflow has a cycle. Please ensure there are no circular dependencies between nodes.",
      );
    }
    throw error; // rethrow other errors
  }
  // Map sorted node IDs back to nodes
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
