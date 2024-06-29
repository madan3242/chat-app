import { AxiosResponse } from "axios";
import {
  ApiResponseInterface,
  ChatListInterface,
  UserInterface,
} from "../interfaces";

export const requestHandler = async (
  api: () => Promise<AxiosResponse<ApiResponseInterface, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: ApiResponseInterface) => void,
  onError: (error: string) => void
) => {
  // Show loading state if setLoading function is provided
  setLoading && setLoading(true);
  try {
    // Make the API request
    const response = await api();
    const { data } = response;
    if (data?.success) {
      // Call the onSuccess callback with the response data
      onSuccess(data);
    }
  } catch (error: any) {
    //Handle error cases, including unauthorized and forbidden cases
    if ([401, 403].includes(error?.response.data?.statusCode)) {
      localStorage.clear();
      if (isBrowser) window.location.href = "/login";
    }
    onError(error?.response.data?.message || "Something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};

export const isBrowser = typeof window !== "undefined";

export class LocalStorage {
  static get(key: string) {
    if (!isBrowser) return;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Set a value in local storage y key
  static set(key: string, value: any) {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Remove a value from local storage y key
  static remove(key: string) {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }

  // Cear all items from local storage
  static clear() {
    if (!isBrowser) return;
    localStorage.clear();
  }
}

// This utility function generates metadata for chat objects.
// It takes into consideration both group chats and individual chats.
export const getChatOjectMetadata = (
  chat: ChatListInterface,
  loggedInUser: UserInterface
) => {
  // Determine the content of the last message, if any.
  const lastMessage = chat.lastMessage?.content
    ? chat.lastMessage
    : "No messages yet"; //Placeholder text if there are no messages.

  if (chat.isGroupChat) {
    // In case of group chat return metadata specific to group chats.
    return {
      // Default avatar for group chats.
      avatar: "https://via.placeholder.com/100x100.png",
      title: chat.name,
      description: `${chat.participants.length} members in the chat`,
      lastMessage: chat.lastMessage
        ? chat.lastMessage?.sender?.username + ": " + lastMessage
        : lastMessage,
    };
  } else {
    // In case of individual chat Identify the participant other than logged-in user.
    const participant = chat.participants.find(
      (p) => p._id !== loggedInUser?._id
    );

    // Return metadata specific to individual chats.
    return {
      avatar: participant?.avatar,
      title: participant?.username,
      description: participant?.email,
      lastMessage: lastMessage,
    };
  }
};
