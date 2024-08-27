/* eslint-disable */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const characterRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.character.findFirst({
      where: {
        id: input,
      },
      include: {
        origin: true,
        masks: {
          where: {
            OR: [{ isDeleted: null }, { isDeleted: false }],
          },
          include: {
            kigu: true,
            maskPics: true,
            maker: true,
          },
        },
      },
    });
  }),
  getByOrigin: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        origin: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor, origin } = input;
      const items = await ctx.prisma.character.findMany({
        take: limit + 1,
        where: {
          origin: {
            id: origin,
          },
          masks: {
            some: {},
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        include: {
          origin: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem ? nextItem.id : undefined;
      }
      const totalCount = await ctx.prisma.character.count();

      return {
        items,
        nextCursor,
        totalCount,
      };
    }),
  getByName: publicProcedure
    .input(
      z.object({
        originId: z.number().optional(),
        name: z.string(),
        locale: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      const { originId, name, locale } = input;

      const nameField =
        locale === "ja" ? "name_jp" : locale === "zh" ? "name_zh" : "name";

      const whereClause: any = {
        OR: [
          {
            [nameField]: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],

        masks: {
          some: {},
        },
      };
      if (originId) {
        whereClause.originId = originId;
      }

      return ctx.prisma.character.findMany({
        take: 12,
        where: whereClause,
        include: {
          origin: true,
        },
      });
    }),
  getMostPopular: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.character.findMany({
      orderBy: {
        masks: {
          _count: "desc",
        },
      },
      take: 24,
      include: {
        masks: {
          where: {
            OR: [{ isDeleted: null }, { isDeleted: false }],
          },
          include: {
            _count: true,
          },
        },
        origin: true,
      },
    });
  }),
});
