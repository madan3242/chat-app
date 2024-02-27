import React, { useState } from "react";
import { ChatListInterface } from "../../interfaces";
import { useAuth } from "../../context/AuthContext";
import { requestHandler } from "../../utils";
import { deleteUserChat } from "../../api";
import GroupChatDetailsModal from "./GroupChatDetailsModal";

const ChatItem: React.FC<{
  chat: ChatListInterface;
  onClick: (chat: ChatListInterface) => void;
  isActive?: boolean;
  unreadCount?: number;
  onChatDelete: (chatId: string) => void;
}> = ({ chat, onClick, isActive, unreadCount = 0, onChatDelete }) => {
  const { user } = useAuth();
  const [openOptions, setOpenOptions] = useState(false);
  const [openGroupInfo, setOpenGroupInfo] = useState(false);

  const deleteChat = async () => {
    await requestHandler(
      async () => await deleteUserChat(chat._id),
      null,
      () => {
        onChatDelete(chat._id);
      },
      alert
    );
  };

  if (!chat) return;

  return (
    <>
      <GroupChatDetailsModal
        open={openGroupInfo}
        onClose={() => {
          setOpenGroupInfo(false);
        }}
        chatId={chat._id}
        onGroupDelete={onChatDelete}
      />
      <div
        role="button"
        onClick={() => onClick(chat)}
        onMouseLeave={() => setOpenOptions(false)}
        className={``}
      >
        <button></button>
      </div>
    </>
  );
};

export default ChatItem;
