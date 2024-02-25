import React from "react"
import { ChatListInterface } from "../../interfaces"

const ChatItem: React.FC<{
    chat: ChatListInterface;
    onClick: (chat: ChatListInterface) => void;
    isActive?: boolean;
    unreadCount?: number;
    onChatDelete: (chatId: string) => void;
}> = ({chat, onClick, isActive, unreadCount = 0, onChatDelete}) => {
    
  return (
    <div>ChatItem</div>
  )
}

export default ChatItem