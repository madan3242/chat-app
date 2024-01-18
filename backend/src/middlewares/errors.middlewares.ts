import { Errors } from "../utils/types";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (err: Errors, req: Request, res: Response, next: NextFunction) => {
    let error: Errors = { ...err };
    error.statusCode = err.statusCode || 500;
    error.message = err.message || "Internal Server Error";

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Sorry can't find that!");
} 