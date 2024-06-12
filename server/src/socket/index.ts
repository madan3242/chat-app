import { Socket } from "socket.io";
import cookie from "cookie";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models";
import { Request } from "express";
import { ChatEventEnums } from "../constants";

interface IJwtPayload extends JwtPayload {
  id: string;
}

const initilizeSocketIO = (io: any) => {
  return io.on("connection", async (socket: Socket) => {
    // console.log("Connected with Socket.IO");
    try {
      // parse the cookies from the handshake headers (This is only possible if client has `withCredintials: true`)
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.token;

      if (!token) {
        // if there is no access token in cookies. Check inside the handshake auth
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        // Token is required for the socket to work
        throw new ErrorHandler(401, "Unauthorized handshake, Token is missing");
      }

      const decodedToken = jwt.verify(token, JWT_SECRET) as IJwtPayload;

      const user = await User.findById(decodedToken?._id).select("-password");

      // retrive the user
      if (!user) {
        throw new ErrorHandler(401, "Unauthorized handshake, Token is invalid");
      }

      (socket as any).user = user;

      socket.join(user._id.toString());
      socket.emit(ChatEventEnums.CONNECTED_EVENT);
      console.log("User connected. UserId:", user._id.toString());

      socket.on(ChatEventEnums.JOIN_CHAT_EVENT, (chatId) => {
        console.log(`User joined the chat. chatId: ${chatId}`);
        socket.join(chatId);
      });

      socket.on(ChatEventEnums.TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(ChatEventEnums.TYPING_EVENT, chatId);
      });

      socket.on(ChatEventEnums.STOP_TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(ChatEventEnums.STOP_TYPING_EVENT, chatId);
      });

      // socket.on(ChatEventEnums.DISCONNECT_EVENT, () => {
      //   console.log(`User disconnected . userId: ${socket.user?._id as any}`);
      //   if (socket.user?._id) {
      //     socket.leave(socket.user?._id);
      //   }
      // });
      
    } catch (error: any) {
      socket.emit(
        ChatEventEnums.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
};

const emitSocketEvent = (
  req: Request,
  roomId: string,
  event: string,
  payload: any
) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initilizeSocketIO, emitSocketEvent };
