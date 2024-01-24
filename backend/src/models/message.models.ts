import mongoose from "mongoose";
import { IMessage } from "../interfaces";

const messageSchema = new mongoose.Schema<IMessage>({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  content: { 
    type: String
  },
  chat: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Chat" 
  }
}, { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);