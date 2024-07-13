export const ChatEventEnums = Object.freeze({
    CONNECTED_EVENT: "connected",

    DISCONNECT_EVENT: "disconnect",

    JOIN_CHAT_EVENT: "joinChat",

    LEAVE_CHAT_EVENT: "leaveChat",

    NEW_CHAT_EVENT: "newChat",

    TYPING_EVENT: "typing",

    STOP_TYPING_EVENT: "stopTyping",

    MESSAGE_RECEIVED_EVENT: "messageReceived",

    UPDATE_GROUP_NAME_EVENT: "updateGroupname",

    SOCKET_ERROR_EVENT: "socketError",

    MESSAGE_DELETE_EVENT: "messageDeleted"
});

export const AvailaleChatEvents = Object.values(ChatEventEnums);
