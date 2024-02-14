import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const kiguRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.kigu.findFirst({
      where: {
        id: input,
      },
      include: {
        masks: {
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
        name: {
          contains: input,
          mode: "insensitive",
        },
      },
      include: {
        masks: true,
      },
    });
  }),
});
