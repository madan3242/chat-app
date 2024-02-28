import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { LocalStorage, getChatOjectMetadata, requestHandler } from "../utils";
import { getChatMessages, getUserChats, sendMessage } from "../api";
import { ChatListInterface, ChatMessageInterface } from "../interfaces";
import { PlusIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Typing from "../components/chat/Typing";
import AddChatModal from "../components/chat/AddChatModal";
import ChatItem from "../components/chat/ChatItem";
import MessageItem from "../components/chat/MessageItem";

const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinchat";
const NEW_CHAT_EVENT = "newchat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stoptyping";
const MESSAGE_RECIVED_EVENT = "messagerecived";
const LEAVE_CHAT_EVENT = "leavechat";
const UPDATE_GROUP_NAME_EVENT = "updategroupname";

const Chat: React.FC = () => {
  //import 'useAuth' and 'useSocket' hooks from there respective contexts
  const { user } = useAuth();
  const { socket } = useSocket();

  //Create a refernce using 'useRef' to hold the currently selected chat.
  const currentChat = useRef<ChatListInterface | null>(null);

  // To keep track of the setTimeout function
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define state variales and their initial values using 'useSate'
  const [isConnected, setIsConnected] = useState(false); //For tracking socket connection

  const [openAddChat, setOpenAddChat] = useState(false); //To control the'Add Chat' modal
  const [loadingChats, setLoadingChats] = useState(false); //To indicate loading of chats
  const [loadingMessages, setLoadingMessages] = useState(false); //To indicate loading of messages

  const [chats, setChats] = useState<ChatListInterface[]>([]); //To store users chats
  const [messages, setMessages] = useState<ChatMessageInterface[]>([]); // To store chat messages
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    []
  ); //To track unread messages

  const [isTyping, setIsTyping] = useState(false); //To track someone is connrently typing
  const [selfTyping, setSelfTyping] = useState(false); // To track if the current user is typing

  const [message, setMessage] = useState(""); //To store currently typed message
  const [localSearchQuery, setLocalSearchQuery] = useState(""); //For local search functionality

  /**
   * A function to update the last message of a specified chat to update the chat list
   */
  const updateChatLastMessage = (
    chatToUpdateId: string,
    message: ChatMessageInterface // The new message to e set as last message
  ) => {
    // Search for the chat with the given ID in the chats array
    const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;

    // Update the 'lastMessage' field of the found chat with the new message
    chatToUpdate.updatedAt = message.updatedAt;

    // Update the state of chats, placing the updated chat at the begining of the array
    setChats([
      chatToUpdate, // Place the updated chat first
      ...chats.filter((chat) => chat._id !== chatToUpdateId), //Include all other chats expect the updated one
    ]);
  };

  const getChats = async () => {
    requestHandler(
      async () => await getUserChats(),
      setLoadingChats,
      (res) => {
        const { data } = res;
        setChats(data || []);
      },
      alert
    );
  };

  const getMessages = async () => {
    // Check if a chat is selected, if not, show an alert
    if (!currentChat.current?._id) return alert("No chat is selected");

    // Check if socket is availale, if not, show an alert
    if (!socket) return alert("Socket not availale");

    // Emit an event to join the current chat
    socket.emit(JOIN_CHAT_EVENT, currentChat.current?._id);

    // Filter out unread messages from the current chat as those will e read
    setUnreadMessages(
      unreadMessages.filter((msg) => msg.chat !== currentChat.current?._id)
    );

    // Make an async request to fetch chat messages for the current chat
    requestHandler(
      //Fetching messages for the current chat
      async () => await getChatMessages(currentChat.current?._id || ""),
      //Set state to loading while fetching the messages
      setLoadingMessages,
      // After fetching, set the chat messages to the state if availale
      (res) => {
        const { data } = res;
        setChats(data || []);
      },
      //Display any error alerts if they occur during the fetch
      alert
    );
  };

  //Function to send a chat message
  const sendChatMessages = async () => {
    // If no current chat ID exists or there's no socket connection, exit the function
    if (!currentChat.current?._id || !socket) return;

    // Emit a STOP_TYPING_EVENT to inform other users/participats that typing has stopped
    socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

    // Make an async request to send the message and and handle potential response or error
    requestHandler(
      //Trying to send the chat message
      async () =>
        await sendMessage(
          currentChat.current?._id || "", // Chat ID or empty string if not available
          message //Actual text message
        ),
      null,
      // On successful message sending , clear the message input
      (res) => {
        setMessage(""); //Clear the message input
        setMessages((prev) => [res.data, ...prev]); //Update messages in the UI
        updateChatLastMessage(currentChat.current?._id || "", res.data); // Update the last message in chat
      },
      //Display any error alerts if they occur during the message sending process
      alert
    );
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Update the message state with the current input value
    setMessage(e.target.value);

    //if socket dosen't exist or in't connected, exit the function
    if (!socket || !isConnected) return;

    //Check if user isn't already set as typing
    if (!selfTyping) {
      //Set the user as typing
      setSelfTyping(true);

      //Emit a typing event to the server for the current chat
      socket.emit(TYPING_EVENT, currentChat.current?._id);
    }

    //Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define a length of time (in milliseconds) for the typing timeout
    const timerLength = 3000;

    //Set a timeout to stop the typing indication after the timerLength has passed
    typingTimeoutRef.current = setTimeout(() => {
      // Emit a stop typing event to the server for the current chat
      socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

      // Reset the user's typing state
      setSelfTyping(false);
    }, timerLength);
  };

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  /**
   * Handles the "typing" event on the socket
   */
  const handleOnSocketTyping = (chatId: string) => {
    //Check if the typig event is for the currently active chat
    if (chatId !== currentChat.current?._id) return;

    // Set the typing state to true for the current chat.
    setIsTyping(true);
  };

  /**
   * Handles the "stop typing" event on the socket
   */
  const handleOnSocketStopTyping = (chatId: string) => {
    //Check if the stop typig event is for the currently active chat
    if (chatId !== currentChat.current?._id) return;

    // Set the typing state to false for the current chat.
    setIsTyping(false);
  };

  /**
   * Handles event when new message is recived.
   */
  const onMessageRecived = (message: ChatMessageInterface) => {
    // Check if the recived message elongs to the currently active chat
    if (message?.chat !== currentChat.current?._id) {
      // If not, update the list of unread messages
      setUnreadMessages((prev) => [message, ...prev]);
    } else {
      // If it elongs to the current chat, update the messages list for the active chat
      setMessages((prev) => [message, ...prev]);
    }

    // Update the last message for the chat to which the recived message belongs
    updateChatLastMessage(message.chat || "", message);
  };

  const onNewChat = (chat: ChatListInterface) => {
    setChats((prev) => [chat, ...prev]);
  };

  /**
   * Handles event when user leaves the chat.
   */
  const onChatLeave = (chat: ChatListInterface) => {
    // Check if the chat the user is leaving is the current active chat.
    if (chat._id === currentChat.current?._id) {
      // If the user is in the group chat they're leaving, close the chat window.
      currentChat.current = null;
      // Remove the currentChat from local storage.
      LocalStorage.remove("currentChat");
    }
    // Update the chats y removing the chat that the user left.
    setChats((prev) => prev.filter((c) => c._id !== chat._id));
  };

  /**
   * Handles change in group name.
   */
  const onGroupNameChange = (chat: ChatListInterface) => {
    // Check if the chat being changed is the currently active chat
    if (chat._id === currentChat.current?._id) {
      // Update the current chat with the new details
      currentChat.current = chat;

      // Save the updated chat details to local storage
      LocalStorage.set("currentChat", chat);
    }

    // Update the list of chats with the new details
    setChats((prev) => [
      // Map through the previous chats
      ...prev.map((c) => {
        // If the current chat in the map matches the chat being changed, return the updated chat
        if (c._id === chat._id) {
          return chat;
        }
        // Otherwise, return the chat as-is without any changes
        return c;
      }),
    ]);
  };

  useEffect(() => {
    // Fetch the chat list from the server.
    getChats();

    // Retrive the current chat details from local storage.
    const _currentChat = LocalStorage.get("currentChat");

    // If there's a current chat saved in local storage
    if (_currentChat) {
      //Set the current chat saved in local storage.
      currentChat.current = _currentChat;
      // If the socket connection exists, emit an event to join the specific chat using it's ID
      socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id);
      // Fetch the messages for the current chat.
      getMessages();
    }
    // An empty dependency array ensures this useEffect runs only once, similar to componentDidMount.
  }, []);

  useEffect(() => {
    // If the socket isn't initialized, we don't set up listeners.
    if (!socket) return;

    //Set up event listeners for various socket events:
    // Linstener for when the socket connnects.
    socket.on(CONNECTED_EVENT, onConnect);
    // Linstener for when the socket disconnnects.
    socket.on(DISCONNECT_EVENT, onDisconnect);
    // Linstener for when user is typing.
    socket.on(TYPING_EVENT, handleOnSocketTyping);
    // Linstener for when user stops typing.
    socket.on(STOP_TYPING_EVENT, handleOnSocketStopTyping);
    // Linstener for when new message recived.
    socket.on(MESSAGE_RECIVED_EVENT, onMessageRecived);
    // Linstener for initiation of new chat.
    socket.on(NEW_CHAT_EVENT, onNewChat);
    // Linstener for when user leaves a chat.
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);
    // Linstener for when a group name is updated.
    socket.on(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);

    return () => {
      // Remove all the event listeners we set up to avoid memory leaks and unintended behaviours.
      socket.off(CONNECTED_EVENT, onConnect);
      socket.off(DISCONNECT_EVENT, onDisconnect);
      socket.off(TYPING_EVENT, handleOnSocketTyping);
      socket.off(STOP_TYPING_EVENT, handleOnSocketStopTyping);
      socket.off(MESSAGE_RECIVED_EVENT, onMessageRecived);
      socket.off(NEW_CHAT_EVENT, onNewChat);
      socket.off(LEAVE_CHAT_EVENT, onChatLeave);
      socket.off(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
    };
  }, [socket, chats]);

  return (
    <>
      <AddChatModal
        open={openAddChat}
        onClose={() => {
          setOpenAddChat(false);
        }}
        onSuccess={() => {
          getChats();
        }}
      />

      <div className="w-full relative flex justify-between items-stretch flex-shrink-0 h-[calc(100vh-4rem)]">
        <div className="w-1/4 relative overflow-y-auto px-3 bg-blue-100">
          <div className="z-10 w-full sticky top-0 flex justify-between items-center py-3 gap-3">
            <input
              type="text"
              placeholder="Search user or group..."
              className="block w-full rounded-xl outline outline-[1px] outline-zinc-400 border-0 py-2 px-3 font-light placeholder:text-gray-600 "
              value={localSearchQuery}
              onChange={(e) =>
                setLocalSearchQuery(e.target.value.toLowerCase())
              }
            />
            <button
              onClick={() => setOpenAddChat(true)}
              className="rounded-xl border-none bg-blue-400 text-white py-2 px-4"
            >
              <PlusIcon className="h-6 w-6 text-blue-600" />
            </button>
          </div>
          {loadingChats ? (
            <>
              <div className="flex items-center justify-center h-[calc(100% - 64px)]">
                <Typing />
              </div>
            </>
          ) : (
            // Iterating over chats array
            [...chats]
              // Filtering chats ased on a local query
              .filter((chat) =>
                // if there's a localSearchQuery, filter chats that contain the query in their metadata
                localSearchQuery
                  ? getChatOjectMetadata(chat, user!)
                      .title?.toLocaleLowerCase()
                      ?.includes(localSearchQuery)
                  : // If there's no localSearchQuery, include all chats
                    true
              )
              .map((chat) => {
                return (
                  <ChatItem
                    chat={chat}
                    isActive={chat._id === currentChat.current?._id}
                    unreadCount={
                      unreadMessages.filter((n) => n.chat === chat._id).length
                    }
                    onClick={(chat) => {
                      if (
                        currentChat.current?._id &&
                        currentChat.current?._id === chat._id
                      )
                        return;

                      LocalStorage.set("currentChat", chat);
                      currentChat.current = chat;
                      setMessage("");
                      getMessages();
                    }}
                    key={chat._id}
                    onChatDelete={(chatId) => {
                      setChats((prev) =>
                        prev.filter((chat) => chat._id !== chatId)
                      );
                      if (currentChat.current?._id === chatId) {
                        currentChat.current = null;
                        LocalStorage.remove("currentChat");
                      }
                    }}
                  />
                );
              })
          )}
        </div>

        <div className="w-3/4 bg-blue-50">
          {currentChat.current && currentChat.current?._id ? (
            <>
              <div className="p-4 sticky top-0 bg-dark flex justify-between items-center w-full border-[0.1px] border-secondary">
                <div className="w-max flex justify-start items-center gap-3">
                  {currentChat.current.isGroupChat ? (
                    <div className="w-12 h-12 relative flex-shrink-0 flex justify-start items-center flex-nowrap">
                      {currentChat.current.participants
                        .slice(0, 3)
                        .map((participant, i) => {
                          return (
                            <img
                              key={participant._id}
                              src={participant.avatar}
                              className={`w-9 h-9 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark
                                      ${
                                        i === 0
                                          ? "left-0 z-[3]"
                                          : i == 1
                                          ? "left-2 z-[2]"
                                          : i == 2
                                          ? "left-4 z-[1]"
                                          : ""
                                      }
                                  `}
                            />
                          );
                        })}
                    </div>
                  ) : (
                    <img
                      className="w-14 h-14 rounded-full flex flex-shrink-0 object-cover"
                      src={
                        getChatOjectMetadata(currentChat.current, user!).avatar
                      }
                    />
                  )}
                  <div>
                    <p className="font-bold">
                      {getChatOjectMetadata(currentChat.current, user!).title}
                    </p>
                    <small className="text-zinc-400">
                      {
                        getChatOjectMetadata(currentChat.current, user!)
                          .description
                      }
                    </small>
                  </div>
                </div>
              </div>
              <div
                className="p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full"
                id="message-window"
              >
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-[calc(100% - 88px)]">
                    <Typing />
                  </div>
                ) : (
                  <>
                    {isTyping ? <Typing /> : null}
                    {messages?.map((msg) => {
                      return (
                        <MessageItem
                          key={msg._id}
                          message={msg}
                          isOwnMessage={msg.sender?._id === user?._id}
                          isGroupChatMessage={currentChat.current?.isGroupChat}
                        />
                      );
                    })}
                  </>
                )}
              </div>
              <div className="sticky top-full p-4 flex justify-between items-center w-full gap-2 border-t-[0.1px] border-secondary">
                <input
                  placeholder="Message"
                  value={message}
                  onChange={handleMessageChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendChatMessages();
                    }
                  }}
                />
                <button
                  onClick={sendChatMessages}
                  disabled={!message}
                  className="p-4 rounded-full bg-dark hover:bg-secondary disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-full flex items-center justify-center">
                No chat selected
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
