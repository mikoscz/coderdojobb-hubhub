import express, { Request, Response } from "express";
import { MoviesController } from "./library/movies.controller";
import { MoviesService } from "./library/movies.service";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./drizzle/schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export type AppConfig = {
  dbUrl: string;
};

export function build(config: AppConfig) {
  const app = express();

  const sqlite = new Database(config.dbUrl);
  const db = drizzle(sqlite, { schema });

  // @ts-ignore
  app.db = db;
  // migrate(db, { migrationsFolder: "drizzle" });

  app.use(express.json());
  app.use(new MoviesController(new MoviesService(db)).routes);

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.json({
      api: "ok",
    });
  });

  return app;
}

// /videos -> all available vidoes
// /movies -> all available movies
// /series -> all available series
