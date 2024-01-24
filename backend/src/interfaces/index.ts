import { Request as ExpressRequest } from "express";
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

export interface Request extends ExpressRequest {
  user: IUser;
}

export interface IChat {
  chatName?: string;
  isGroupChat?: boolean;
  lastMessage?: Types.ObjectId;
  participants?: [];
  groupAdmin?: Types.ObjectId;
}

export interface IMessage {
  sender?: Types.ObjectId;
  content?: string;
  chat?: Types.ObjectId;
  readBy?: Types.ObjectId;
}