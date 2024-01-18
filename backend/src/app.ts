import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errors.middlewares";
// import passport from "passport";

const app = express();

const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// app.use(passport.initialize());
// app.use(passport.session());

/**
 * Routes
 */
import { chatRouter, messageRouter, userRouter } from "./routes";

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

/**
 * Error middleware
 */
app.use(errorMiddleware);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:4000"
  }
});

io.on("connection", (socket) => {
  console.log("Connected with Socket.IO");
  socket.on("setup", (userData) => {
    console.log(userData._id);
    socket.emit("connected");
  })

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log('User joined room: '+room);
  })

  socket.on("typing", (room) => {
    socket.in(room).emit("typing")
  })

  socket.on("stopTyping", (room) => {
    socket.in(room).emit("stop typing")
  })

  socket.on("newMessage", (newMessageRecived) => {
    let chat = newMessageRecived.chat;

    if(!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user: any) => {
      if (user._id == newMessageRecived.sender._id) return;

      socket.in(user._id).emit("message recived", newMessageRecived)
    });
  });

  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id)
  })
});

export default httpServer;