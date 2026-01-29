import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import z from "zod";
export const workflowsRouter = createTRPCRouter({
  // create a new workflow with a random name
  create: premiumProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3), // generate a random name with 3 words
        userId: ctx.auth.user.id,
      },
    });
  }),
  // delete a workflow by id
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.deleteMany({
        where: { id: input.id, userId: ctx.auth.user.id },
      });
    }),
  // update the name of a workflow
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: { id: input.id, userId: ctx.auth.user.id },
        data: { name: input.name },
      });
    }),
  // Basically getOne ka mtlb hota hai get a single workflow by id
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx }) => {
      return prisma.workflow.findUnique({
        where: { id: ctx.auth.user.id },
      });
    }),
    // Get all workflows for the authenticated user
  getMany: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany({
      where: { userId: ctx.auth.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),
});
