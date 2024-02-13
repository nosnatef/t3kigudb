import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const maskRouter = createTRPCRouter({
  getByCharacterId: publicProcedure
    .input(z.string())
    .query(({ctx, input}) => {
      return ctx.prisma.mask.findMany({
        where: {
          character: {
            id: input
          }
        },
        include: {
          kigu: true
        }
      })
  }),
  getByKiguId: publicProcedure
    .input(z.string())
    .query(({ctx, input}) => {
      return ctx.prisma.mask.findMany({
        where: {
          kigu: {
            id: input
          }
        },
        include: {
          character: true
        }
      })
}),
  getUnidentifiedMasks: protectedProcedure
    .query(({ctx}) => {
      return ctx.prisma.mask.findMany(({
        where: {
          makerId: null
        }
      }))
    }),
  updateMakerForMask: protectedProcedure
    .input(z.object({
      id: z.string(),
      makerId: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, makerId } = input;
      await ctx.prisma.mask.update({
        where: {
          id: id
        },
        data: {
          makerId: makerId
        }
      })
    })
})