import { Socket } from "socket.io";
import cookie from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models";
import { Request } from "express";
import { ChatEventEnums } from "../constants";
import ApiError from "../utils/ApiError";

interface IJwtPayload extends JwtPayload {
  id: string;
}

const mountJoinChatEvent = (socket: Socket) => {
  socket.on(ChatEventEnums.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat. chatId: ${chatId}`);
    socket.join(chatId);
  })
}

const mountParticipantTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnums.TYPING_EVENT, (chatId: string) => {
    socket.in(chatId).emit(ChatEventEnums.TYPING_EVENT, chatId);
  })
}

const mountParticipantStoppedTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnums.STOP_TYPING_EVENT, (chatId: string) => {
    socket.in(chatId).emit(ChatEventEnums.STOP_TYPING_EVENT, chatId);
  })
}

const initilizeSocketIO = (io: any) => {
  return io.on("connection", async (socket: any) => {
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
        throw new ApiError(401, "Unauthorized handshake, Token is missing");
      }

      const decodedToken = jwt.verify(token, JWT_SECRET) as IJwtPayload;

      const user = await User.findById(decodedToken?.id).select("-password");

      // retrive the user
      if (!user) {
        throw new ApiError(401, "Unauthorized handshake, Token is invalid");
      }

      socket.user = user;

      socket.join(user._id.toString());
      socket.emit(ChatEventEnums.CONNECTED_EVENT);
      console.log("User connected. UserId:", user._id.toString());

      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      socket.on(ChatEventEnums.DISCONNECT_EVENT, () => {
        console.log(`User disconnected . userId: ${socket.user?._id}`);
        if (socket.user?._id) {
          socket.leave(socket.user?._id);
        }
      });
      
    } catch (error: any) {
      socket.emit(
        ChatEventEnums.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
};

const emitSocketEvent = (req: Request, roomId: string, event: string, payload: any) => {
  console.log("roomid: "+roomId);
  console.log("event: "+event);
  console.log(payload);
  
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initilizeSocketIO, emitSocketEvent };
