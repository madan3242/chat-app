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

export default ErrorHandler;