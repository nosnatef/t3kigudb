import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const maskRouter = createTRPCRouter({
  getByCharacterId: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.mask.findMany({
        where: {
          character: {
            id: input,
          },
        },
        include: {
          kigu: true,
        },
      });
    }),
  getByKiguId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.mask.findMany({
      where: {
        kigu: {
          id: input,
        },
      },
      include: {
        character: true,
      },
    });
  }),
  getUnidentifiedMasks: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        page: z.number().min(1).nullish() // Optional page parameter for pagination
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor, page } = input;

      // Determine the skip value based on the page number
      let skip = page && page > 1 ? (page - 1) * limit : 0;

      if (cursor) {
        skip = 0; // Reset skip if cursor-based navigation is used
      }

      const items = await ctx.prisma.mask.findMany({
        take: limit + 1,
        skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: 'asc' },
        where: {
          makerId: null
        }
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
        // Optionally, include the current page and total pages for page-based navigation
        currentPage: page || 1,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),
  updateMakerForMask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        makerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, makerId } = input;
      await ctx.prisma.mask.update({
        where: {
          id: id,
        },
        data: {
          makerId: makerId,
        },
      });
    }),
});
