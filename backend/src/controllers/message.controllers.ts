import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Chat, Message } from "../models";
import ErrorHandler from "../utils/ErrorHandler";

/**
 * @description To get all messages
 * @route       POST /api/v1/message/:chatId
 */
export const allMessages = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
    const { content, chatId} = req.body;

    if (!content || !chatId) {
        return next(new ErrorHandler(400, "Invalid data"));
    }
    
    var newMessage = {
        sender: req.user._id,
        content: content,
        chatId: chatId
    }

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name profilePicture email");
    message = await message.populate("chat");
    message = await message.populate(message, {
        path: "chat.users",
        select: "name profilePicture email"
    })

    await Chat.findByIdAndUpdate(chatId, {lastestMessage: message});

    res.status(200).json(new ApiResponse(200, message));
})