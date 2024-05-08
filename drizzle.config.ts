import type { Config } from "drizzle-kit";
export default {
  dbCredentials: {
    url: "./hubhub.db",
  },
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
} satisfies Config;
