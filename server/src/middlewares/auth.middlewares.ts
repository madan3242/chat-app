import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models";
import { IUser } from "../interfaces";
import ApiError from "../utils/ApiError";

interface DecodedPayload extends JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export const isLoggedIn = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Login first to access this page"));
    }

    const decoded: any = <DecodedPayload>jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return next(new ApiError(401, "Unauthorized Access"));
    }

    const user = await User.findById(decoded.id).select(
      "-password -createdAt -updatedAt"
    );

    req.user = user;

    next();
  }
);
