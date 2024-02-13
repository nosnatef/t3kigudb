import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const originRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.origin.findMany();
  }),
});
