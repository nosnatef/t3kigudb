import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const characterRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.character.findFirst({
        where: {
          id: input,
        },
        include: {
          origin: true,
          masks: {
            include:{
              kigu: true,
              maskPics: true,
              maker: true
            }
          }
        }
      })
    }),
  getByOrigin: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).nullish(), cursor: z.string().nullish(), origin: z.string() }))
    .query(async ({ctx, input}) => {
      const limit = input.limit ?? 10;
      const { cursor, origin } = input;
      const items = await ctx.prisma.character.findMany({
        take: limit + 1,
        where: {
          origin:{
            name: origin
          }
        },
        cursor: cursor ? {id: cursor} : undefined,
        orderBy: {
          id: 'asc',
        },
        include: {
          origin: true
        }
      })
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem ? nextItem.id : undefined;
      }
      const totalCount = await ctx.prisma.character.count();

      return {
        items,
        nextCursor,
        totalCount
      }
    }),
    getByName: publicProcedure
      .input(z.string())
      .query(({ ctx, input }) => {
        return ctx.prisma.character.findMany({
          take: 12,
          where: {
            name: {
              contains: input,
              mode: 'insensitive'
            },
          },
          include: {
            origin: true
          }
        })
      }),
    getMostPopular: publicProcedure
      .query(({ ctx }) => {
        return ctx.prisma.character.findMany({
          orderBy: {
            masks: {
              _count: 'desc'
            }
          },
          take: 24,
          include: {
            masks: {
              include: {
                _count: true
              }
            },
            origin: true
          }
        })
      })
});