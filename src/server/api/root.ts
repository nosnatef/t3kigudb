import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { characterRouter } from "./routers/character";
import { originRouter } from "./routers/origin";
import { maskRouter } from "./routers/mask";
import { makerRouter } from "./routers/maker";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  character: characterRouter,
  origin: originRouter,
  mask: maskRouter,
  maker: makerRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
