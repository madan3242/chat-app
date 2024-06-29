import React from "react";
import { ChatMessageInterface } from "../../interfaces";
import moment from "moment";

const MessageItem: React.FC<{
  isOwnMessage?: boolean;
  isGroupChatMessage?: boolean;
  message: ChatMessageInterface;
}> = ({ message, isOwnMessage, isGroupChatMessage }) => {
  return (
    <>
      {}
      <div
        className={`
                flex justify-start items-end gap-3 max-w-lg
                ${isOwnMessage ? "ml-auto" : ""}
            `}
      >
        <img
          src={message.sender?.avatar}
          className={`
                    h-9 w-9 object-cover rounded-full flex flex-shrink-0
                    ${isOwnMessage ? "order-2" : "order-1"}
                `}
        />
        <div
          className={`
            p-4 rounded-3xl flex flex-col
            ${
              isOwnMessage
                ? "order-1 rounded-br-none bg-purple-400"
                : "order-2 rounded-bl-none bg-purple-300"
            }
        `}
        >
          {isGroupChatMessage && !isOwnMessage ? (
            <p
              className={`
                    text-xs font-semibold m-2
                    ${
                      ["text-success", "text-danger"][
                        message.sender.username.length % 2
                      ]
                    }
                `}
            >
              {message?.sender?.username}
            </p>
          ) : null}

          {message.content ? (
            <p className="text-sm">{message.content}</p>
          ) : null}

          <p
            className={`*:mt-1.5 self-end text-[10px] inline-flex items-center
                ${isOwnMessage ? "text-zinc-50" : "text-zinc-400"}
            `}
          >
            {moment(message.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
            ago
          </p>
        </div>
      </div>
    </>
  );
};

export default MessageItem;
