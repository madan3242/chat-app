import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
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