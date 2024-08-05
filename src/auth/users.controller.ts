import { Request, Response, Router } from "express";
import { UsersService } from "./users.service";
import { v4 as uuid } from "uuid";
import { createInsertSchema } from "drizzle-zod";
import { users } from "../drizzle/schema";
import { z } from "zod";
import jwt from "jsonwebtoken";

const createSchema = createInsertSchema(users).omit({ id: true });
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export class UsersController {
  public routes = Router();

  constructor(private readonly usersService: UsersService) {
    this.routes.get("/users", this.index);
    //this.routes.get("/test", this.testSignIn);
    this.routes.get("/users/:id", this.get);
    this.routes.post("/users", this.create);
    this.routes.delete("/users/:id", this.delete);
    this.routes.patch("/users/:id", this.update);
    this.routes.post("/sign-up", this.register);
    this.routes.post("/sign-in", this.signIn);
    this.routes.post("/sign-out", this.signOut);
  }

  index = async (req: Request, res: Response) => {

    if(!req.cookies['autorization']){
      throw new Error("Unauthorized");
    }

    const authorization = req.cookies['autorization'];

    const payload = jwt.verify(authorization, process.env.SECRET);
    console.log(payload);
    

    res.json({
      data: await this.usersService.getAllUsers(),
    });
  };

  // testSignIn = async (req: Request, res: Response) => {
 
  //   // await this.usersService.register({email: "Test@test.com", password: "password"});

  //   let { token, user } = await this.usersService.logIn(
  //     { 
  //       email: "Test@test.com", 
  //       password: "password"
  //     }
  //   );

  //   const formatedUser = {
  //     id: user.id,
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName
  //   };

  //   const date = new Date();
  //   date.setDate(date.getDate() + 1);
  //   res.cookie("autorization", token, { domain: "hubhub.local", sameSite: "lax", httpOnly: true, expires: date });

  //   res.status(200).json({
  //     data: formatedUser,
  //   });
  // };

  
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
    const user = await this.usersService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
      });
    }

    await this.usersService.deleteUserById(req.params.id);

    res.json({
      data: user,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.usersService.updateUser(id, req.body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user });
  };

  register = async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.errors,
      });
    }

    await this.usersService.register({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    res.status(201).json({
      data: {},
    });
  };

  signIn = async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.errors,
      });
    }

    let { token, user } = await this.usersService.logIn(
      { 
        email: parsed.data.email, 
        password: parsed.data.password
      }
    );

    const formatedUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    res.cookie("autorization", token, { domain: "hubhub.local", sameSite: "lax", secure: true, httpOnly: true });

    res.status(200).json({
      data: formatedUser,
    });
  };

  signOut = async (_req: Request, res: Response) => {

    res.clearCookie("autorization", { domain: "hubhub.local" }); 

    res.status(200).json();
  };
}
