import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "./ApiResponse";

class ErrorHandler extends Error {
    statusCode: number;
    status: string
    constructor(statusCode: number, message: string) {
        super();
        this.status = "error"
        this.statusCode = statusCode,
        this.message = message
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleError = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = err;
    console.error(err);
    res.status(statusCode || 500).json({
        status: "error",
        statusCode: statusCode || 500,
        message: statusCode === 500 ? "An error occurred" : message,
    });
    next();
};

const notFound = (req: Request, res: Response) => {
    res.status(404).json(new ApiResponse(404, "Page not found!"));
}

export {
    ErrorHandler,
    handleError,
    notFound
}