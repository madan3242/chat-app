import axios from "axios";
import { LocalStorage } from "../utils";

//Create Axios instance for API requests
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  withCredentials: true,
  timeout: 1200000,
});

// Add an intercepter to set authorization header with user token bofore requests
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

export const loginUser = (data: {username: string; password: string}) => {
  return apiClient.post("/login", data);
};

export const signupUser = (data: {username: string; email: string; password: string}) => {
  return apiClient.post("/signup", data);
};

export const logoutUser = () => {
  return apiClient.get("/logout");
};

export const getChatMessages = (chatId: string) => {
  return apiClient.get(`/messages/${chatId}`);
};

export const sendMessage = (chatId: string, content: string, attachments: File[]) => {
  const formData = new FormData();
  if (content) {
    formData.append("content", content);
  }

  attachments?.map((file) => {
    formData.append("attachments", file)
  });

  return apiClient.post(`/messages/${chatId}`, formData);
};

export const deleteMessage = (chatId: string, messageId: string) => {
  return apiClient.delete(`/messages/${chatId}/${messageId}`);
};

export const getAvailableUsers = () => {
  return apiClient.get("/chats/users");
};

export const getUserChats = () => {
  return apiClient.get("/chats/");
};

export const createUserChat = (receiverId: string) => {
  return apiClient.post(`/chats/c/${receiverId}`);
};

export const deleteUserChat = (chatId: string) => {
  return apiClient.delete(`/chats/${chatId}`);
};

export const createGroupChat = (name: string, participants: string[]) => {
  return apiClient.post(`/chats/group`, { name, participants });
};

export const getGroupInfo = (chatId: string) => {
  return apiClient.get(`/chats/group/${chatId}`);
};

export const updateGroupName = (chatId: string, name: string) => {
  return apiClient.patch(`/chats/group/${chatId}`, { name });
};

export const deleteGroupChat = (chatId: string) => {
  return apiClient.delete(`/chats/group/${chatId}`);
};

export const leaveGroupChat = (chatId: string) => {
  return apiClient.delete(`/chats/group/leave/${chatId}`);
};

export const addParticipantsToGroup = (chatId: string, participantId: string) => {
  return apiClient.post(`/chats/group/${chatId}/${participantId}`);
};

export const removeParticipantsFromGroup = (chatId: string, participantId: string) => {
  return apiClient.delete(`/chats/group/${chatId}/${participantId}`);
};
