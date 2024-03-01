import axios from "axios";
import { LocalStorage } from "../utils";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    withCredentials: true,
    timeout: 1200000
});

apiClient.interceptors.request.use(
  function (config) {
    const token = LocalStorage.get("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

type loginData = {
    username?: string,
    password?: string
}

type signupData = {
    username?: string,
    email?: string,
    password?:string
}

export const loginUser = (data: loginData) => {    
    return apiClient.post("/login", data);
};

export const signupUser = (data: signupData) => {      
    return apiClient.post("/signup", data);
};

export const logoutUser = () => {
    return apiClient.get("/logout");
};

export const getAvailableUsers = () => {
  return apiClient.get("/chats/users");
}

export const getUserChats = () => {
  return apiClient.get("/chats");
}

export const createUserChat = (receiverId: string) => {
  return apiClient.post(`/chats/c/${receiverId}`);
}

export const deleteUserChat = (chatId: string) => {
  return apiClient.delete(`/chats/${chatId}`);
}

export const createGroupChat = (name: string, participants: string[]) => {
  return apiClient.post(`/chats/group`, {name, participants});
}

export const getGroupInfo = (chatId: string) => {
  return apiClient.get(`/chats/group/${chatId}`);
}

export const updateGroupName = (chatId: string, name: string) => {
  return apiClient.patch(`/chats/group/${chatId}`, name);
}

export const deleteGroupChat = (chatId: string) => {
  return apiClient.delete(`/chats/group/${chatId}`);
}

export const addParticipantsToGroup = (chatId: string, participantId: string) => {
  return apiClient.post(`/chats/group/${chatId}/${participantId}`);
}

export const removeParticipantsFromGroup = (chatId: string, participantId: string) => {
  return apiClient.delete(`/chats/group/${chatId}/${participantId}`);
}

export const leaveGroupChat = (chatId: string) => {
  return apiClient.delete(`/chats/group/leave/${chatId}`);
}

export const getChatMessages = (chatId: string) => {
  return apiClient.get(`/messages/${chatId}`);
}

export const sendMessage = (chatId: string, content: string) => {
  return apiClient.post(`/messages/${chatId}`, content);
}