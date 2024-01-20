import mongoose, { Types } from "mongoose";

export interface IMessage {
  sender?: Types.ObjectId;
  content?: string;
  chat?: Types.ObjectId;
  readBy?: Types.ObjectId;
}

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
  },
  readBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
}, { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);