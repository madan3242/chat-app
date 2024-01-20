import { ObjectId } from "mongodb";
import { Request as ExpressRequest } from "express";

enum UserRoles {
  user = "user",
  admin = "admin",
}

export interface IUser {
  _id?: ObjectId;
  profilePicture?: string;
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