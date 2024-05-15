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
    this.routes.post("/movies", this.create);
    this.routes.get("/movies/:id", this.getMovie);
    this.routes.delete("/movies/:id", this.deleteMovie);
    this.routes.put("/movies/:id", this.updateMovie);
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


  getMovie = async (req: Request, res: Response) => {
    const {id} = req.params;
    const movie = await this.moviesService.getMovieById(id);
    if (!movie) {
      return res.status(404).json({message: "Movie not found"});
    }
    res.json({data: movie});
  }

  deleteMovie = async (req: Request, res: Response) => {
    const {id} = req.params;
    const movie = await this.moviesService.getMovieById(id);
    if (!movie) {
      return res.status(404).json({message: "Movie not found"});
    }

    await this.moviesService.deleteMovie(id);
    res.json({message: "Movie deleted successfully"});
  }

  updateMovie = async (req: Request, res: Response) => {
    const {id} = req.params;
    const movie = await this.moviesService.updateMovie(id, req.body)

    console.log("movie", movie)
    if (!movie) {
      return res.status(404).json({message: "Movie not found"});
    }

    res.json({data:movie });

  }


}
