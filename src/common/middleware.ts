import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/sign-in" || req.path === "/sign-up" || req.path === "/sign-out" || req.path === "/test") {
      next();
      return;
    }

    const token = req.cookies["autorization"];

    if (!token) {
      res.status(403).json();
      return;
    }

    try {
      jwt.verify(token, process.env.SECRET);
    } catch (error) {
        res.status(403).json();
        return;
    }

    next();
  };
}
