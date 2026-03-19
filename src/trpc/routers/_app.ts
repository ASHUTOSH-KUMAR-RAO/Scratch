
import { createTRPCRouter,  } from "../init";
import { workflowsRouter } from "@/features/workflow/server/router";
import { credentialsRouter } from "@/features/credentials/servers/router";
export const appRouter = createTRPCRouter({
  workflows:workflowsRouter,
  credentials:credentialsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
