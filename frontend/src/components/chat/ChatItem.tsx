import React, { useState } from "react";
import { ChatListInterface } from "../../interfaces";
import { useAuth } from "../../context/AuthContext";
import { getChatOjectMetadata, requestHandler } from "../../utils";
import { deleteUserChat } from "../../api";
import GroupChatDetailsModal from "./GroupChatDetailsModal";
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";

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
        className={`
            group p-4 my-2 flex justify-between gap-3 items-start cursor-pointer rounded-3xl hover:bg-secondary
            ${isActive ? "border-[1px] border-zinc-500 bg-secondary" : ""}
            ${
              unreadCount > 0
                ? "border-[1px] border-success bg-success/20 font-bold"
                : ""
            }
        `}
      >
        <button
          className="self-center p-1 relative"
          onClick={(e) => {
            e.stopPropagation();
            setOpenOptions(!openOptions);
          }}
        >
          <EllipsisVerticalIcon className="h-6 group-hover:w-6 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-300" />
          <div
            className={`
                    z-20 text-left absolute bottom-0 translate-y-full text-sm w-52 bg-dark rounded-2xl p-2 shadow-md border-[1px] border-secondary
                    ${openOptions ? "block" : "hidden"}
                `}
          >
            {chat.isGroupChat ? (
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenOptions(true);
                }}
                role="button"
                className="p-4 w-full rounded-lg inline-flex items-center hover:bg-secondary"
              >
                <InformationCircleIcon className="h-4 w-4 mr-2" /> About group
              </p>
            ) : (
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  const ok = confirm(
                    "Are you sure you want to delete this chat ?"
                  );
                  if (ok) {
                    deleteChat();
                  }
                }}
                role="button"
                className="p-4 text-danger rounded-lg w-full inline-flex items-center hover:bg-secondary"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete chat
              </p>
            )}
          </div>
        </button>
        <div className="flex justify-center items-center flex-shrink-0">
          {chat.isGroupChat ? (
            <div className="w-12 h-12 relative flex justify-start items-center flex-shrink-0 flex-nowrap">
              {chat.participants.slice(0, 3).map((participant, i) => {
                return (
                  <img
                    key={participant.username}
                    src={participant.avatar}
                    className={`w-7 h-7 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark group-hover:outline-secondary
                        ${
                          i === 0
                            ? "left-0 z-[3]"
                            : i == 1
                            ? "left-2.5 z-[2]"
                            : i == 2
                            ? "left-[18px] z-[1]"
                            : ""
                        }
                    `}
                  />
                );
              })}
            </div>
          ) : (
            <img
              src={getChatOjectMetadata(chat, user!).avatar}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
        <div className="w-full">
          <p className="truncate-1">
            {getChatOjectMetadata(chat, user!).title}
          </p>
          <div className="w-full inline-flex items-center text-left">
            <small className="text-white/50 truncate-1 text-sm text-ellipsis inline-flex items-center">
              {getChatOjectMetadata(chat, user!).lastMessage}
            </small>
          </div>
        </div>
        <div className="h-full flex text-white/50 text-sm flex-col justify-between items-end">
          <small className="mb-2 inline-flex flex-shrink-0 w-max">
            {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
          </small>

          {unreadCount <= 0 ? null : (
            <span className="bg-success h-2 w-2 aspect-square flex-shrink-0 p-2 text-white text-xs rounded-full inline-flex justify-center items-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatItem;
