import { Types } from "mongoose";

enum UserRoles {
  user = "user",
  admin = "admin",
}

export interface IUser {
  _id?: Types.ObjectId;
  avatar?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRoles;
  createdAt?: string;
  updatedAt?: string;
}

export interface IChat {
  name?: string;
  isGroupChat?: boolean;
  lastMessage?: Types.ObjectId;
  participants?: [];
  admin?: Types.ObjectId;
}

export interface IMessage {
  sender?: Types.ObjectId;
  content?: string;
  chat?: Types.ObjectId;
  readBy?: Types.ObjectId;
}

export interface UserInterface {
  _id?: Types.ObjectId;
  avatar?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRoles;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatInterface {
  name?: string;
  isGroupChat?: boolean;
  lastMessage?: Types.ObjectId;
  participants?: [];
  admin?: Types.ObjectId;
}

export interface MessageInterface {
  sender?: Types.ObjectId;
  content?: string;
  attachments?:
  [{
    url?: string,
    localPath?: string
  }]
  chat?: Types.ObjectId;
  readBy?: Types.ObjectId;
}
