import express, { Request, Response } from "express";

import { MoviesController } from "./library/movies.controller";
import { MoviesService } from "./library/movies.service";

export function build() {
  const app = express();

  app.use(express.json());
  app.use(new MoviesController(new MoviesService()).routes);

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
