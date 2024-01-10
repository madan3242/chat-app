import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

export const verifyToken = AsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        return next(new ApiError(401, "Unauthorized request"));
    }

    // try {
        
    // } catch (error) {
    //     return next(new ApiError(401, error?.message || "Invalid Access Token"))
    // }
})