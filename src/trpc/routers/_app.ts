import { baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/db";
export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query(() => {
    // todo While the core principle holds: query → GET, mutations → POST—there are nuances
    return prisma.user.findMany();
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
