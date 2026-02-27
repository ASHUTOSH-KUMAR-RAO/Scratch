import { PAGINATION } from "@/config/constants";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { NodeType } from "@prisma/client";
import { Edge, Node } from "@xyflow/react";
import { generateSlug } from "random-word-slugs";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  execute: protectedProcedure.input(z.object({id:z.string()})).mutation(async({input,ctx})=>{
    const workflow = await prisma.workflow.findUniqueOrThrow({
      where:{id:input.id,userId:ctx.auth.user.id},
    });

    await inngest.send({
      id: `workflow-execution-${workflow.id}-${Date.now()}`,
      name: "workflows/execute.workflow",
      data: {
        workflowId: input.id,
        userId: ctx.auth.user.id,
      },
    });
    // For demonstration, we just return the workflow data. In a real implementation, you would execute the workflow logic here.
    return {
      message: `Workflow ${workflow.name} executed successfully!`,
      workflow,
    };
  }),
  // Create a new workflow with a random name
  create: premiumProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3), // Generate random name with 3 words
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });
  }),

  // Delete a workflow by id
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      // ✅ Use delete instead of deleteMany for single item deletion
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id, // Security: Only delete user's own workflows
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          }),
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id, userId: ctx.auth.user.id },
      });
      // Transition to ensure the consistency
      return await prisma.$transaction(async (tx) => {
        // Deleting existing nodes and connections :-
        await tx.node.deleteMany({
          where: { workflowId: id },
        });
        // Create Nodes
        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        });
        // create Connections :-
        await tx.connection.createMany({
          data: edges.map((edge) => ({
            workflowId: id,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });
        // Update workflow's updatedAt timestamp
        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });
        return workflow;
      });
    }),
  // Update the name of a workflow
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: { id: input.id, userId: ctx.auth.user.id },
        data: { name: input.name },
      });
    }),

  // Get a single workflow by id with nodes and edges
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch workflow with related nodes and connections
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id, // Workflow ID
          userId: ctx.auth.user.id, // Security: Only access user's own workflows
        },
        include: { nodes: true, connections: true },
      });

      // Transform server nodes to react-flow compatible format
      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));

      // Transform server connections to react-flow compatible edges
      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      // ✅ Return all data in one go (fixed duplicate return issue)
      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),

  // Get all workflows for the authenticated user with pagination
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      // Fetch workflows and total count in parallel for better performance
      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page - 1) * pageSize, // Calculate offset for pagination
          take: pageSize, // Limit results per page
          where: {
            userId: ctx.auth.user.id, // Security: Only user's workflows
            name: { contains: search, mode: "insensitive" }, // Case-insensitive search
          },
          orderBy: {
            updatedAt: "desc", // Show most recently updated first
          },
        }),
        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: { contains: search, mode: "insensitive" },
          },
        }),
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
