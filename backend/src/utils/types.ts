import { ObjectId } from "mongodb";

export type Errors = {
  message?: string;
  statusCode?: number;
};

export interface IUser {
  _id?: ObjectId,
  profilePicture?: {
    url?: string,
    localPath?: string
  },
  username?: string,
  email?: string,
  password?: string,
  role?:string,
  createdAt?: string,
  updatedAt?: string
}

export type Token = {
  id?: string,
  email?: string
}