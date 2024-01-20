import { Response, NextFunction } from "express";
import { Request } from "./types";

type func = (req: Request, res: Response, next: NextFunction) => void;

export const AsyncHandler = (func: func) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  }; 