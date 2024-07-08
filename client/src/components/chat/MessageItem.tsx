import React, { useState } from "react";
import { ChatMessageInterface } from "../../interfaces";
import moment from "moment";
import { ArrowDownTrayIcon, EllipsisVerticalIcon, MagnifyingGlassPlusIcon, PaperClipIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const MessageItem: React.FC<{
  isOwnMessage?: boolean;
  isGroupChatMessage?: boolean;
  message: ChatMessageInterface;
  deleteChatMessage: (message: ChatMessageInterface) => void;
}> = ({ message, isOwnMessage, isGroupChatMessage, deleteChatMessage }) => {
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [openOptions, setOpenOptions] = useState<boolean>(false); // To open delete menu option on hover

  return (
    <>
      {resizedImage ? (
        <div className="h-full z-40 p-4 overflow-hidden w-full absolute inset-0 bg-purple-950/70 flex justify-center items-center">
          <XMarkIcon
            className="absolute top-5 right-5 w-9 h-9 text-white cursor-pointer"
            onClick={() => setResizedImage(null)}
          />
          <img
            className="w-full h-full object-contain"
            src={resizedImage}
            alt="chat image"
          />
        </div>
      ) : null}
      <div
        className={`
                flex justify-start items-end gap-3 max-w-lg
                ${isOwnMessage ? " ml-auto" : ""}
            `}
      >
        <img
          src={message.sender?.avatar}
          className={`
                    h-7 w-7 object-cover rounded-full flex flex-shrink-0
                    ${isOwnMessage ? " order-2" : " order-1"}
                `}
        />
        {/* message box have to add the icon onhover here */}
        <div
          onMouseLeave={() => setOpenOptions(false)}
          className={`
            p-4 rounded-3xl flex flex-col cursor-pointer group hover:bg-purple-300
            ${isOwnMessage ? " order-1 rounded-br-none bg-purple-400"
                           : " order-2 rounded-bl-none bg-purple-700/50"}
          `}
        >
          {isGroupChatMessage && !isOwnMessage ? (
            <p
              className={`
                    text-xs font-semibold m-2
                    ${["text-success", "text-danger"][message.sender.username.length % 2]}
                `}
            >
              {message?.sender?.username}
            </p>
          ) : null}

          {message?.attachments?.length > 0 ? (
            <div>
              {/* {isOwnMessage ? (
                <button
                  className="self-center p-1 relative options-button"
                  onClick={() => setOpenOptions(!openOptions)}
                >
                  <EllipsisVerticalIcon className="group-hover:w-4 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-700" />
                  <div
                   className={`
                      delete-menu z-20 text-left -translate-x-24 -translate-y-4 absolute bottom-0 text-[14px] w-auto bg-zinc-200 rounded-2xl shadow-md border-[1px] border-gray-300
                      ${openOptions ? "block" : "hidden"}
                    `}
                  >
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        const ok = confirm(
                          "Are you sure you want to delete this message"
                        );
                        if (ok) {
                          deleteChatMessage(message);
                        }
                      }}
                      role="button"
                      className="p-2 rounded-lg w-auto inline-flex items-center text-red-500 hover:bg-zinc-300"
                    >
                      <TrashIcon className="h-7 w-7 mr-2" />
                      Delete Message
                    </p>
                  </div>
                </button>
              ) : null} */}

              <div
                className={`grid max-w-7xl gap-2
                  ${message.attachments?.length === 1 ? " grid-cols-1" : ""}
                  ${message.attachments?.length === 3 ? " grid-cols-3" : ""}
                  ${message.attachments?.length >= 3 ? " grid-cols-3" : ""}
                  ${message.content ? " mb-4" : ""}
                `}
              >
                {message.attachments?.map((file) => {
                  return(
                    <div
                      key={file._id}
                      className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                    >
                      <button
                        onClick={() => setResizedImage(file.url)}
                        className="absolute inset-0 z-20 flex justify-center items-center w-full gap-2 h-full bg-black/60 group-hover:opacity-100 opacity-0 ease-in-out duration-150"
                      >
                        <MagnifyingGlassPlusIcon className="h-6 w-6 text-white" />
                        <a 
                          href={file.url}
                          download
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowDownTrayIcon 
                            title="download"
                            className="h-6 w-6 cursor-pointer text-white hover:text-zinc-400"
                          />
                        </a>
                      </button>
                      <img 
                        className="h-72 w-72 object-cover"
                        src={file.url} 
                        alt="msg img" 
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {message.content ? (
            <div className="relative flex justify-between">
              <p className={`text-sm ${isOwnMessage ? " text-zinc-50" : " text-zinc-700"}`}>{message.content}</p>
              {/* The option to delete message will only open in case of own messages */}
              {isOwnMessage ? (
                <button
                  className="self-center relative options-button"
                  onClick={() => setOpenOptions(!openOptions)}
                >
                  <EllipsisVerticalIcon className="group-hover:w-4 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-700" />
                  <div
                   className={`
                      delete-menu z-20 text-left -translate-x-24 -translate-y-4 absolute bottom-0 text-[14px] w-auto bg-zinc-200 rounded-2xl shadow-md border-[1px] border-gray-300
                      ${openOptions ? " block" : " hidden"}
                    `}
                  >
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        const ok = confirm(
                          "Are you sure you want to delete this message"
                        );
                        if (ok) {
                          deleteChatMessage(message);
                        }
                      }}
                      role="button"
                      className="p-2 rounded-lg w-auto inline-flex items-center text-red-500 hover:bg-zinc-300"
                    >
                      <TrashIcon className="h-7 w-7 mr-2" />
                      Delete Message
                    </p>
                  </div>
                </button>
              ) : null}

            </div>
          ) : null}

          <p
            className={`mt-1.5 self-end text-[10px] inline-flex items-center
                ${isOwnMessage ? " text-zinc-50" : " text-zinc-500"}
            `}
          >
            {message.attachments?.length > 0 ? (
              <PaperClipIcon className="h-4 w-4 mr-2" />
            ) : null}
            {moment(message.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
            ago
          </p>
        </div>
      </div>
    </>
  );
};

export default MessageItem;
