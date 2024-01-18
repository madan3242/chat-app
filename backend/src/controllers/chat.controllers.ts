import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { Chat, User } from "../models";

/**
 * @description Create or Access one to one chat
 * @route       POST /api/v1/chat/
 */
export const accessChat = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    if (!userId) {
        return next(new ApiError(400, 'UserID not found'));
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: {$eq: req.user._id} } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name profilePicture email"
    })


    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }
    };

    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id}).populate(
        "users",
        "-password"
    )

    res.status(200).json(FullChat)
})

/**
 * @description Fetch all chats for user
 * @route       GET /api/v1/chat/
 */
export const fetchAllChats = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1})
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name profilePicture email"
                })
                res.status(200).send(results);
            })
})

/**
 * @description Create new group chat
 * @route       POST /api/v1/chat/group
 */
export const createGroupChat = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.users || !req.body.name) {
        return next(new ApiError(400, 'Please fill all the fields'));
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return next(new ApiError(400, 'More than 2 users required.'));
    }

    users.push(req.user);

    const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    res.status(200).json(fullGroupChat);
})

/**
 * @description Rename  group chat
 * @route       PUT /api/v1/chat/rename
 */
export const renameGroupChat = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName
        }, {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if (!updatedChat) {
        return next(new ApiError(404, 'Chat not found'))
    }

    res.status(200).json(updatedChat)
})

/**
 * @description Add user to  group chat
 * @route       PUT /api/v1/chat/add
 */
export const addUserToGroup = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },{
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if (!added) {
        return next(new ApiError(404, 'Chat not found'))
    }

    res.status(200).json(added)
})

/**
 * @description Remove user from  group chat
 * @route       PUT /api/v1/chat/remove
 */
export const removeUserFromGroup = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, userId} = req.body;

    //Check if requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        },{
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if (!removed) {
        return next(new ApiError(404, 'Chat not found'))
    }

    res.status(204).json(removed)
})