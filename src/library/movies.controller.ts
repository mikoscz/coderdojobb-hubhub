import { Request, Response, Router } from "express";
import { MoviesService } from "./movies.service";
import { v4 as uuid } from "uuid";
import { createInsertSchema } from "drizzle-zod";
import { movies } from "../drizzle/schema";

const createSchema = createInsertSchema(movies).omit({ id: true });

export class MoviesController {
  public routes = Router();

  constructor(private readonly moviesService: MoviesService) {
    this.routes.get("/movies", this.index);
    this.routes.get("/movies/:id", this.get);
    this.routes.post("/movies", this.create);
    this.routes.delete("/movies/:id", this.delete);
    this.routes.patch("/movies/:id", this.update);
  }

  index = async (_req: Request, res: Response) => {
    res.json({
      data: await this.moviesService.getAllMovies(),
    });
  };

  create = async (req: Request, res: Response) => {
    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.errors,
      });
    }

    const newMovie = {
      id: uuid(),
      ...parsed.data,
    };

    res.json({
      data: await this.moviesService.createMovie(newMovie),
    });
  };

  get = async (req: Request, res: Response) => {
    const movie = await this.moviesService.getMovieById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        error: "Not Found",
      });
    }

    res.json({
      data: movie,
    });
  };

  delete = async (req: Request, res: Response) => {
    const movie = await this.moviesService.getMovieById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        error: "Not Found",
      });
    }

    await this.moviesService.deleteMovieById(req.params.id);

    res.json({
      data: movie,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const movie = await this.moviesService.updateMovie(id, req.body);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ data: movie });
  };
}
