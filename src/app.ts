import express, { Request, Response } from "express";
import { MoviesController } from "./library/movies.controller";
import { MoviesService } from "./library/movies.service";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./drizzle/schema";
import { UsersController } from "./auth/users.controller";
import { UsersService } from "./auth/users.service";
import { LikesController } from "./library/likes.controller";
import { LikesService } from "./library/likes.service";
import { LocalEmailProvider, MailerService } from "./common/mailer";
import Database from "better-sqlite3";

export type AppConfig =
  | {
      dbUrl: string;
      db?: never;
    }
  | {
      dbUrl?: never;
      db: Parameters<typeof drizzle>[0];
    };

export function build(config: AppConfig) {
  const app = express();

  const sqlite = config.dbUrl ? new Database(config.dbUrl) : config.db;

  if (!sqlite) {
    throw new Error("Either dbUrl or db must be provided");
  }

  const db = drizzle(sqlite, { schema });

  // @ts-ignore
  app.db = db;
  // migrate(db, { migrationsFolder: "drizzle" });

  app.use(express.json());
  app.use(new MoviesController(new MoviesService(db)).routes);
  app.use(
    new UsersController(
      new UsersService(db, new MailerService(new LocalEmailProvider()))
    ).routes
  );
  app.use(new LikesController(new LikesService(db)).routes);

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
