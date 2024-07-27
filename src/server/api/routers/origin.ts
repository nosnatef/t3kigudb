import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { GroupedOrigins } from "~/types/GroupedOrigins";

export const originRouter = createTRPCRouter({
  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.origin.findFirst({
      where: {
        id: input,
      },
    });
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const origins = await ctx.prisma.origin.findMany();

    // Group origins by type
    const groupedOrigins: GroupedOrigins = origins.reduce(
      (groups: GroupedOrigins, origin) => {
        const type = origin.type;
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type]?.push(origin);
        return groups;
      },
      {}
    );

    // Sort each group alphabetically by name
    Object.keys(groupedOrigins).forEach((type) => {
      if (groupedOrigins[type]) {
        groupedOrigins[type]?.sort((a, b) => a.name.localeCompare(b.name));
      }
    });

    return groupedOrigins;
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
