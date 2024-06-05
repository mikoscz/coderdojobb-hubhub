import { Request, Response, Router } from "express";
import { MoviesService } from "./movies.service";
import { v4 as uuid } from "uuid";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { movies } from "../drizzle/schema";
import { LikesService } from "./likes.service";

const createSchema = createInsertSchema(movies).omit({ id: true });

const likeSchema = z.object({
  userId: z.string().uuid(),
});

export class LikesController {
  public routes = Router();

  constructor(private readonly likesService: LikesService) {
    this.routes.post("/movies/:id/likes", this.create);
    this.routes.delete("/movies/:id/likes", this.delete);
  }

  create = async (req: Request, res: Response) => {
    const { id: movieId } = req.params;

    const parsed = likeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.errors,
      });
    }

    const userId = parsed.data.userId;

    res.json({
      data: await this.likesService.addLikeToMovie(userId, movieId),
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id: movieId } = req.params;

    const parsed = likeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.errors,
      });
    }

    const userId = parsed.data.userId;

    res.json({
      data: await this.likesService.removeLikeFromMovie(userId, movieId),
    });
  };
}
