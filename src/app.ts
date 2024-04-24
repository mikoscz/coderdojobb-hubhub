import express, { Request, Response } from "express";

export function build() {
  const app = express();

  app.get("/test", (_req: Request, res: Response) => {
    res.json({
      test: "hello",
    });
  });

  return app;
}
