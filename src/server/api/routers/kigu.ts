import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const kiguRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.kigu.findFirst({
        where: {
          id: input,
        },
        include: {
          masks: {
            include: {
              character: true
            }
          }
        }
      })
    }),
})