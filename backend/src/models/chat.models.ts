import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isGroupChat: { type: Boolean, default: false },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Chat = mongoose.model("Chat", chatSchema);
