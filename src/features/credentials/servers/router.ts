import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { CredentialType, } from "@prisma/client";
import z from "zod";

export const credentialsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name Is Required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value Is Required"),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { name, value, type } = input;

      return prisma.credentials.create({
        data: {
          name,
          userId: ctx.auth.user.id,
          type,
          value,
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      // ✅ Use delete instead of deleteMany for single item deletion
      return prisma.credentials.delete({
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
        name: z.string().min(1, "Name Is Required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value Is Required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, type, value } = input;
      return prisma.credentials.update({
        where: { id, userId: ctx.auth.user.id },
        data: { type, name, value },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.credentials.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

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
        prisma.credentials.findMany({
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
        prisma.credentials.count({
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
  getByType: protectedProcedure
    .input(
      z.object({
        type: z.enum(CredentialType),
      }),
    )
    .query(({ input, ctx }) => {
      const { type } = input;

      return prisma.credentials.findMany({
        where: {
          type,
          userId: ctx.auth.user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
