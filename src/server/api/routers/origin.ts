import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const originRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.origin.findMany();
  }),
  getOriginIngestionLogs: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.origin.findMany({
      include: {
        ingestionlogs: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })
  })
});
