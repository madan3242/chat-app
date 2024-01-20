import { NextFunction, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models";
import { Request } from "../utils/types";

interface DecodedPayload extends JwtPayload {
    id: string,
    email: string
}

export const isLoggedIn = AsyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const token =  req?.cookies?.token || req?.headers?.authorization?.split(" ")[1]

    if(!token) {
        return next(new ApiError(401, 'Login first to access this page'))
    }

    const decoded = <DecodedPayload>jwt.verify(token, JWT_SECRET);

    if(!decoded) {
        return next(new ApiError(401, 'Unauthorized Access'))
    }

    req.user = await User.findById(decoded.id).select('-password -createdAt -updatedAt:');
    
    next();
})