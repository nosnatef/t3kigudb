import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const makerRouter = createTRPCRouter({
  getMakers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const items = await ctx.prisma.maker.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem ? nextItem.id : undefined;
      }
      const totalCount = await ctx.prisma.maker.count();

      return {
        items,
        nextCursor,
        totalCount,
      };
    }),
  getAllMakers: protectedProcedure.query(({ ctx, input }) => {
    return ctx.prisma.maker.findMany();
  }),
  getByName: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.maker.findMany({
      take: 12,
      where: {
        name: {
          contains: input,
          mode: "insensitive",
        },
      },
    });
  }),
  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.maker.findFirst({
      where: {
        id: input,
      },
      include: {
        masks: {
          include: {
            character: true,
          },
        },
        makerLinks: true,
      },
    });
  }),
});
