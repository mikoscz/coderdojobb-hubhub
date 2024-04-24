import { Request, Response, Router } from "express";
import { MoviesService } from "./movies.service";

export class MoviesController {
  public routes = Router();

  constructor(private readonly moviesService: MoviesService) {
    this.routes.get("/movies", this.index);
  }

  index = (req: Request, res: Response) => {
    res.json(this.moviesService.getAllMovies());
  };
}
