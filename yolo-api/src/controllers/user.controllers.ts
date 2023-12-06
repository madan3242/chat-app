import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

export const login = AsyncHandler(async (req: Request, res: Response, next: NextFunction)  => {
    return next(new ApiError(200, "Not working"));
});