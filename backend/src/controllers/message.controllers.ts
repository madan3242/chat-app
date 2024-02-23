import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Chat, Message } from "../models";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import { emitSocketEvent } from "../socket";
import { ChatEventEnums } from "../constants";

const messageCommonAggregation = () => {
    return [
        {
            $lookup: {
                from: "user",
                foreignFields: "_id",
                localFields: "sender",
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
export const getAllMessages = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
                createdAt: -1
            },
        },
    ]);

    res
        .status(200)
        .json(
            new ApiResponse(200, messages || [], "Messages fetched successfully")
        )
});

/**
 * @description Send message
 * @route       POST /api/v1/message/:chatId
 */
export const sendMessage = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const { chatId } = req.params;

    if (!content) {
        throw new ErrorHandler(400, "Message content is required");
    }

    const selectedChat = await Chat.findById(chatId);

    if (!selectedChat) {
        throw new ErrorHandler(404, "Chat don't exist");
    }

    //create new message instance
    const message = await Message.create({
        sender: new mongoose.Types.ObjectId(req.user?._id),
        content: content || "",
        chat: new mongoose.Types.ObjectId(chatId) 
    })
    
    //Update the chat's last message
    const chat = await Chat.findByIdAndUpdate(
        chatId,
        {
            $set: {
                lastMessage: message._id,
            },
        },
        { new: true }
    )

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

    chat?.participants?.forEach((participantOjectId) => {
        if (participantOjectId as string === req.user?._id?.toString()) return;

        emitSocketEvent(
            req,
            participantOjectId as string,
            ChatEventEnums.MESSAGE_RECIVED_EVENT,
            receivedMessage
        )
    })

    res.status(200).json(new ApiResponse(200, receivedMessage, "Message saved successfully"));
})