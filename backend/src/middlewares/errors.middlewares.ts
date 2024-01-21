import { ApiResponse } from "../utils/ApiResponse";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";

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

const notFoundError = (req: Request, res: Response) => {
    res.status(404).json(new ApiResponse(404, "Page not found!"));
}

export {
    handleError,
    notFoundError
}