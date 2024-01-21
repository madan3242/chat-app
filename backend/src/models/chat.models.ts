import mongoose from "mongoose";
import { IChat } from "../interfaces";

const chatSchema = new mongoose.Schema<IChat>({
  chatName: { 
    type: String, 
    required: true 
  },
  isGroupChat: { 
    type: Boolean, 
    default: false 
  },
  lastestMessage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Message" 
  },
  users: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  ],
  groupAdmin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
}, { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
