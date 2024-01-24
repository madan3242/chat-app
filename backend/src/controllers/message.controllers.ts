import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Chat, Message } from "../models";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";

/**
 * @description To get all messages
 * @route       POST /api/v1/message/:chatId
 */
export const getAllMessages = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "username profilePicture email")
        .populate("chat");

    res.status(200).json(new ApiResponse(200, messages))
})

/**
 * @description Send message
 * @route       POST /api/v1/message/send
 */
export const sendMessage = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const { chatId } = req.params;

    if (!content) {
        throw (new ErrorHandler(400, "Message content is required"));
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


    

    // var message = await Message.create(newMessage);

    // message = await message.populate("sender", "name profilePicture email");
    // message = await message.populate("chat");
    // message = await message.populate(message, {
    //     path: "chat.users",
    //     select: "name profilePicture email"
    // })

    await Chat.findByIdAndUpdate(chatId, {lastestMessage: message});

    res.status(200).json(new ApiResponse(200, message));
})