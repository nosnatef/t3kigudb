import { type Origin } from "@prisma/client";

export type GroupedOrigins = {
  [key: string]: Origin[];
};
