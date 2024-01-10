import express, { NextFunction, Request, Response } from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import { Errors } from "./utils/types";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:4000"
  }
});

io.on("connection", (socket) => {
  console.log("Connected with Socket.IO");
  socket.on("setup", () => {
    socket.emit("connected");
  })
});
  
/**
 * Routes
 */
import userRouter from "./routes/user.routes";

app.use("/api/v1", userRouter);



app.use((err: Errors, req: Request, res: Response, next: NextFunction):void => {
  let error: Errors = { ...err };
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Internal Server Error";

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});


export default httpServer;