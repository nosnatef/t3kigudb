import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const kiguRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.kigu.findFirst({
      where: {
        id: input,
        OR: [{ isDeleted: null }, { isDeleted: false }],
      },
      include: {
        masks: {
          where: {
            OR: [{ isDeleted: null }, { isDeleted: false }],
          },
          include: {
            character: true,
            maker: true,
          },
        },
        socialLinks: true,
      },
    });
  }),
  getOneRandom: publicProcedure.query(async ({ ctx }) => {
    const totalCount = await ctx.prisma.kigu.count();
    const skip = Math.floor(Math.random() * totalCount);

    return await ctx.prisma.kigu.findMany({
      take: 1,
      skip: skip,
    });
  }),
  getByName: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.kigu.findMany({
      take: 12,
      where: {
        OR: [{ isDeleted: null }, { isDeleted: false }],
        name: {
          contains: input,
          mode: "insensitive",
        },
        masks: {
          some: {}
        }
      },
      include: {
        masks: {
          where: { OR: [{ isDeleted: null }, { isDeleted: false }] },
        },
      },
    });
  }),
  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.kigu.update({
        where: {
          id: input,
        },
        data: {
          isDeleted: true,
        },
      });

      await ctx.prisma.mask.updateMany({
        where: {
          ownedBy: input,
        },
        data: {
          isDeleted: true,
        },
      });
    }),
});
