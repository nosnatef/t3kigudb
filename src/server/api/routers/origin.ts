import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const originRouter = createTRPCRouter({
  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.origin.findFirst({
      where: {
        id: input,
      },
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.origin.findMany();
  }),
  getOriginIngestionLogs: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.origin.findMany({
      include: {
        ingestionlogs: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });
  }),
});
