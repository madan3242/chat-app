export interface UserInterface {
  _id: string;
  avatar: string;
  username: string;
  email: string;
}

export interface ApiResponseInterface {
  data: any;
  message: string;
  statusCode: number;
  success: boolean;
}

export interface ChatListInterface {
  admin: string;
  createdAt: string;
  isGroupChat: true;
  lastMessage?: ChatMessageInterface;
  name: string;
  participants: UserInterface[];
  updatedAt: string;
  _id: string;
}

export interface ChatListItemInterface {
  _id: string;
  admin: string;
  createdAt: string;
  isGroupChat: true;
  lastMessage?: ChatMessageInterface;
  name: string;
  participants: UserInterface[];
  updatedAt: string;
}

export interface ChatMessageInterface {
  _id: string;
  sender: Pick<UserInterface, "_id" | "avatar" | "email" | "username">;
  content: string;
  chat: string;
  createdAt: string;
  updatedAt: string;
}
