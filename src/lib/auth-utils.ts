import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { TRPCError } from "@trpc/server";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" });
    redirect("/login");
  }
  return session;
};

export const requireUnAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/");
  }
};
