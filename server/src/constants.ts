export const ChatEventEnums = Object.freeze({
    CONNECTED_EVENT: "connected",

    DISCONNECT_EVENT: "disconnect",

    JOIN_CHAT_EVENT: "joinchat",

    LEAVE_CHAT_EVENT: "leavechat",

    NEW_CHAT_EVENT: "newchat",

    TYPING_EVENT: "typing",

    STOP_TYPING_EVENT: "stoptyping",

    MESSAGE_RECIVED_EVENT: "messagerecived",

    UPDATE_GROUP_NAME_EVENT: "updategroupname",

    SOCKET_ERROR_EVENT: "socketError",

    MESSAGE_DELETE_EVENT: "messageDeleted"
});

export const AvailaleChatEvents = Object.values(ChatEventEnums);
