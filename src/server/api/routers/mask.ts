import { z } from "zod";

import {
  createTRPCRouter,
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
  })
})