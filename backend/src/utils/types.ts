import { Request as ExpressRequest, request } from "express";
import { ObjectId } from "mongodb";

export type Errors = {
  message?: string;
  statusCode?: number;
};

enum UserRoles {
  user = "user",
  admin = "admin"
}

export interface IUser {
  _id?: ObjectId,
  profilePicture?: string,
  username?: string,
  email?: string,
  password?: string,
  role?: UserRoles,
  createdAt?: string,
  updatedAt?: string
}

export interface IChat {

}

export interface IMessage {

}

export interface Request extends ExpressRequest {
  user: IUser;
}