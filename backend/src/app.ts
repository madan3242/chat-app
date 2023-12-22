import express, { NextFunction, Request, Response } from "express"
import { createServer } from "http";
import { Server } from "socket.io";

import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import fs from "fs";

import userRouter from "./routes/user.routes";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log(socket);
});



const file = fs.readFileSync("./swagger.yaml", "utf8");
// const swaggerDocument = ;
app.use("/", swaggerUi.serve, swaggerUi.setup(YAML.parse(file)));

app.use("/api/v1", userRouter);

export type Errors = {
  message?: string;
  statusCode?: number;
};

app.use((err: Errors, req: Request, res: Response, next: NextFunction) => {
  let error: Errors = { ...err };
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Internal Server Error";

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});


export default httpServer;