import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Chat, Message } from "../models";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import { emitSocketEvent } from "../socket";
import { ChatEventEnums } from "../constants";
import { getLocalPath, getStaticFilePath, removeLocalFile } from "../utils/helpers";

const messageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "sender",
        as: "sender",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        sender: { $first: "$sender" },
      },
    },
  ];
};

/**
 * @description To get all messages
 * @route       POST /api/v1/message/:chatId
 */
export const getAllMessages = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
      throw new ErrorHandler(404, "No chat found");
    }

    if (req.user?._id) {
      if (!selectedChat.participants?.includes(req.user._id as never)) {
        throw new ErrorHandler(400, "User is not a part of this chat");
      }
    }

    const messages = await Message.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId),
        },
      },
      ...messageCommonAggregation(),
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(200, messages || [], "Messages fetched successfully")
      );
  }
);

/**
 * @description Send message
 * @route       POST /api/v1/message/:chatId
 */
export const sendMessage = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { content } = req.body;

    const files = req.files as {[fieldname: string]: Express.Multer.File[]};

    if (!content && !files?.attachments?.length) {
      throw new ErrorHandler(400, "Message content is required");
    }

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
      throw new ErrorHandler(404, "Chat don't exist");
    }

    const messageFiles: any = [];

    if (req.files && files.attachments.length > 0) {
      files.attachments?.map((attachment) => {
        messageFiles.push({
          url: getStaticFilePath(req, attachment.filename),
          localPath: getLocalPath(attachment.filename)
        })
      })
    }

    //create new message instance
    const message = await Message.create({
      sender: new mongoose.Types.ObjectId(req.user?._id),
      content: content || "",
      chat: new mongoose.Types.ObjectId(chatId),
      attachments: messageFiles
    });

    //Update the chat's last message
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          lastMessage: message._id,
        },
      },
      { new: true }
    );

    // structure the message
    const messages = await Message.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(message._id),
        },
      },
      ...messageCommonAggregation(),
    ]);

    //Store the aggregation result
    const receivedMessage = messages[0];

    if (!receivedMessage) {
      throw new ErrorHandler(500, "Internal server error");
    }

    chat?.participants?.forEach((participantOjectId: string) => {
      if (participantOjectId.toString() === req.user?._id?.toString()) return;

      // emit the recive message event to the other participants with recived message as payload
      emitSocketEvent(
        req,
        participantOjectId as string,
        ChatEventEnums.MESSAGE_RECIVED_EVENT,
        receivedMessage
      );
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, receivedMessage, "Message saved successfully")
      );
  }
);

/**
 * @description Delete message
 * @route       POST /api/v1/message/:chatId/:messageId
 */
export const deleteMessage = AsyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
  const { chatId, messageId } = req.params;

  const chat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
    participants: req.user?._id
  });

  if (!chat) {
    throw new ErrorHandler(404, "Chat does not exist");
  }

  //Find the message ased on message id
  const message = await Message.findOne({
    _id: new mongoose.Types.ObjectId(messageId),
  });

  if (!message) {
    throw new ErrorHandler(401, "Message does not exist");
  }

  if (message.sender?.toString() !== req.user?._id?.toString()) {
    throw new ErrorHandler(
      401, 
      "You are not authorised to delete the message, you are not the sender"
    )
  }
  if (message.attachments?.length) {
    if (message.attachments?.length > 0) {
      message.attachments.map((asset) => {
        removeLocalFile(asset?.localPath);
      });
    }
  }

  //deleting the message DB
  await Message.deleteOne({
    _id: new mongoose.Types.ObjectId(messageId)
  });

  if (chat.lastMessage?.toString() === message._id?.toString()) {
    const lastMessage = await Message.findOne(
      { chat: chatId},
      {},
      { sort: { createdAt: -1 }}
    );

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: lastMessage ? lastMessage._id : null,
    });
  }

  chat.participants?.forEach((participantOjectId: string) => {
    if (participantOjectId.toString() === req.user?._id?.toString()) return;

    emitSocketEvent(
      req,
      participantOjectId.toString(),
      ChatEventEnums.MESSAGE_DELETE_EVENT,
      message._id
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { _id: message._id }, "Message deleted successfully")
    )

});