import { Request, Response, Router } from "express";
import { UsersService } from "./users.service";
import { v4 as uuid } from "uuid";
import { createInsertSchema } from "drizzle-zod";
import { users } from "../drizzle/schema";

const createSchema = createInsertSchema(users).omit({ id: true });

export class UsersController {
  public routes = Router();

  constructor(private readonly usersService: UsersService) {
    this.routes.get("/users", this.index);
    this.routes.get("/users/:id", this.get);
    this.routes.post("/users", this.create);
    this.routes.delete("/users/:id", this.delete);
    this.routes.patch("/users/:id", this.update);
  }

  index = async (_req: Request, res: Response) => {
    res.json({
      data: await this.usersService.getAllUsers(),
    });
  };

  create = async (req: Request, res: Response) => {
    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.errors,
      });
    }

    const newUSers = {
      id: uuid(),
      ...parsed.data,
    };

    res.json({
      data: await this.usersService.createUser(newUSers),
    });
  };

  get = async (req: Request, res: Response) => {
    const user = await this.usersService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
      });
    }

    res.json({
      data: user,
    });
  };

  delete = async (req: Request, res: Response) => {
    const movie = await this.usersService.getUserById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        error: "Not Found",
      });
    }

    await this.usersService.deleteUserById(req.params.id);

    res.json({
      data: movie,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.usersService.updateUser(id, req.body);

    if (!user) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ data: user });
  };
}
