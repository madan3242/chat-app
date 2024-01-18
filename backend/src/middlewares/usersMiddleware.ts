import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models";
import { IUser, Token } from "../utils/types";

export interface CustomRequest extends Request {
    user: IUser
}

export const verifyToken = AsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const token =  req?.cookies?.token || req?.headers?.authorization?.split(" ")[1]

    if(!token) {
        return next(new ApiError(401, 'Login first to access this page'))
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    if(!decoded) {
        return next(new ApiError(401, 'Unauthorized Access'))
    }

    // req.user = decoded;
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
})