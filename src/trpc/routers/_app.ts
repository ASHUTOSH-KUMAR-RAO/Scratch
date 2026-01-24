import { inngest } from "@/inngest/client";
import {  createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
export const appRouter = createTRPCRouter({
  getWorkflow: protectedProcedure.query(() => {
    // todo While the core principle holds: query → GET, mutations → POST—there are nuances
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async() => {

    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "ashu@mail.com",
      },
    });
    return prisma.workflow.create({
      data: {
        name: "New Workflow",
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
