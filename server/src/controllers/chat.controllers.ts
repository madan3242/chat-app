import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { AsyncHandler } from "../utils/AsyncHandler";
import { Chat, Message, User } from "../models";
import { ApiResponse } from "../utils/ApiResponse";
import { emitSocketEvent } from "../socket";
import { ChatEventEnums } from "../constants";
import ApiError from "../utils/ApiError";
import { removeLocalFile } from "../utils/helpers";

const chatCommonAggregation = () => {
  return [
    {
      //lookup for participants present
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
            },
          },
        ],
      },
    },
    {
      // lookup for group chats
      $lookup: {
        from: "messages",
        foreignField: "_id",
        localField: "lastMessage",
        as: "lastMessage",
        pipeline: [
          {
            // get details of the sender
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
        ],
      },
    },
    {
      $addFields: {
        lastMessage: { $first: "$lastMessage" },
      },
    },
  ];
};

const deleteCascadeMessages = async (chatId: string) => {
  // fetch the messages associated with the chat to remove
  const messages = await Message.find({
    chat: new mongoose.Types.ObjectId(chatId),
  });

  let attachments: any = [];

  // get the attachments present in the messages
  attachments = attachments.concat(
    ...messages.map((message) => {
      return message.attachments;
    })
  );

  attachments.forEach((attachment: any) => {
    removeLocalFile(attachment.localPath);
  });

  await Message.deleteMany({
    chat: new mongoose.Types.ObjectId(chatId),
  });
};

export const searchAvailableUsers = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: req.user?._id, // avoid logged in user
          },
        },
      },
      {
        $project: {
          avatar: 1,
          username: 1,
          email: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  }
);

/**
 * @description Fetch all chats for user
 * @route       GET /api/v1/chats/
 */
export const getAllChats = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await Chat.aggregate([
      {
        $match: {
          participants: { $elemMatch: { $eq: req.user?._id } }, //get all chats that have logged in user as a participant
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      ...chatCommonAggregation(),
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, chats || [], "User chats fetched successfully!")
      );
  }
);

/**
 * @description Create or Access one to one chat
 * @route       POST /api/v1/chats/c/:reciverId
 */
export const createOrAccessChat = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;

    //Check if it's a valid receiver
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      throw new ApiError(400, "Receiver does not exist");
    }

    if (req.user?._id) {
      // check if receiver is not the user who is requesting a chat
      if (receiver?._id.toString() === req.user?._id.toString()) {
        throw new ApiError(400, "You cannot chat with yourself");
      }
    }

    const chat = await Chat.aggregate([
      {
        $match: {
          isGroupChat: false, //avoid group chats
          $and: [
            {
              participants: { $elemMatch: { $eq: req.user?._id } },
            },
            {
              participants: {
                $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverId) },
              },
            },
          ],
        },
      },
      ...chatCommonAggregation(),
    ]);

    if (chat.length) {
      // If we find the chat that means user already has created a chat
      return res
        .status(200)
        .json(new ApiResponse(200, chat[0], "Chat retrieved successfully"));
    }

    // If not we need to create a new One to One Chat
    const newChatInstance = await Chat.create({
      name: "One on One Chat",
      participants: [req.user?._id, new mongoose.Types.ObjectId(receiverId)],
    });

    //Structure the chat as per the common aggregation to keep te consistency
    const createdChat = await Chat.aggregate([
      {
        $match: {
          _id: newChatInstance._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = createdChat[0]; //store the aggregation result

    if (!payload) {
      throw new ApiError(500, "Internal server error");
    }

    payload?.participants?.forEach((participant: any) => {
      if (participant._id.toString() === req.user?._id?.toString()) return;

      // emit event to other participants with new chat as payload
      emitSocketEvent(
        req,
        participant._id?.toString(),
        ChatEventEnums.NEW_CHAT_EVENT,
        payload
      );
    });

    return res
      .status(201)
      .json(new ApiResponse(201, payload, "Chat retrieved successfully"));
  }
);

/**
 * @description Create new group chat
 * @route       POST /api/v1/chats/group
 */
export const createGroupChat = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, participants } = req.body;

    if (participants.includes(req.user?._id?.toString())) {
      throw new ApiError(400, "Participants should not contain group creator");
    }

    const members = [...new Set([...participants, req.user?._id?.toString()])];

    if (members.length < 3) {
      throw new ApiError(
        400,
        "Seems like you have passed duplicate participants."
      );
    }

    //Create a group with provided members
    const groupChat = await Chat.create({
      name: name,
      isGroupChat: true,
      participants: members,
      admin: req.user?._id,
    });

    //Structure the chat
    const chat = await Chat.aggregate([
      {
        $match: {
          _id: groupChat._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
      throw new ApiError(500, "Internal server error");
    }

    payload?.participants?.forEach((participant: any) => {
      if (participant.toString() === req.user?._id?.toString()) return;

      emitSocketEvent(
        req,
        participant._id.toString(),
        ChatEventEnums.NEW_CHAT_EVENT,
        payload
      );
    });

    return res
      .status(201)
      .json(new ApiResponse(201, payload, "Group chat created successfully"));
  }
);

/**
 * @description Get group details
 * @route       GET /api/v1/chats/group/:chatId
 */
export const getGroupChatDetails = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const groupChat = await Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
          isGroupChat: true,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const chat = groupChat[0];

    if (!chat) {
      throw new ApiError(404, "Group chat don't exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, chat, "Group chat fetched successfully"));
  }
);

/**
 * @description Rename  group chat
 * @route       PATCH /api/v1/chats/group/:chatId
 */
export const renameGroupChat = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { name } = req.body;

    //Check for group chat
    const groupChat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
      isGroupChat: true,
    });

    if (!groupChat) {
      throw new ApiError(404, "Group chat don't exist");
    }

    //Only admin can change the name
    if (groupChat.admin?.toString() !== req.user?._id?.toString()) {
      throw new ApiError(404, "You are not an admin");
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        name: name,
      },
      { new: true }
    );

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: updatedGroupChat?._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
      throw new ApiError(500, "Internal server error");
    }

    payload?.participants?.forEach((participant: any) => {
      emitSocketEvent(
        req,
        participant._id.toString(),
        ChatEventEnums.UPDATE_GROUP_NAME_EVENT,
        payload
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, payload, "Group chat renamed successfully"));
  }
);

/**
 * @description Delete group chat
 * @route       DELETE /api/v1/chats/group/:chatId
 */
export const deleteGroupChat = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;

    const groupChat = await Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
          isGroupChat: true,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const chat = groupChat[0];

    if (!chat) {
      throw new ApiError(404, "Group chat don't exist");
    }

    //Only admin can delete the name
    if (chat.admin?.toString() !== req.user?._id?.toString()) {
      throw new ApiError(404, "You are not an admin");
    }

    await Chat.findByIdAndDelete(chatId); //delete the chat

    await deleteCascadeMessages(chatId); // remove all messages and attachments

    chat?.participants?.forEach((participant: any) => {
      emitSocketEvent(
        req,
        participant._id.toString(),
        ChatEventEnums.LEAVE_CHAT_EVENT,
        chat
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Group chat deleted successfully"));
  }
);

/**
 * @description Leave group chat
 * @route       DELETE /api/v1/chats/group/leave/:chatId
 */
export const leaveGroupChat = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;

    const groupChat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
      isGroupChat: true,
    });

    if (!groupChat) {
      throw new ApiError(404, "Group chat don't exist");
    }

    const existingParticipants = groupChat.participants;

    //check if the participants that is leaving the group, is part of the group
    if (existingParticipants?.includes(req.user?._id as never)) {
      throw new ApiError(400, "You are not in Group");
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          participants: req.user?._id, //leave group
        },
      },
      { new: true }
    );

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: updatedGroupChat?._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
      throw new ApiError(500, "Internal server error");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Left group successfully"));
  }
);

/**
 * @description Add user to  group chat
 * @route       POST /api/v1/chats/group/:chatId/:participantId
 */
export const addUserToGroup = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, participantId } = req.params;

    //Check if chat is a group
    const groupChat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
      isGroupChat: true,
    });

    if (!groupChat) {
      throw new ApiError(404, "Group chat don't exist");
    }

    //Check if user who is adding is admin
    if (groupChat.admin?.toString() !== req.user?._id?.toString()) {
      throw new ApiError(404, "You are not an admin");
    }

    const existingParticipants = groupChat.participants;

    //check if the participants that is leaving the group, is part of the group
    if (existingParticipants?.includes(req.user?._id as never)) {
      throw new ApiError(400, "You are already in group");
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          participants: participantId, //add new participant to group
        },
      },
      { new: true }
    );

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: updatedGroupChat?._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
      throw new ApiError(500, "Internal server error");
    }

    // emit new chat event to the added participant
    emitSocketEvent(req, participantId, ChatEventEnums.NEW_CHAT_EVENT, payload);

    return res
      .status(200)
      .json(new ApiResponse(200, payload, "Participant added successfully"));
  }
);

/**
 * @description Remove user from  group chat
 * @route       DELETE /api/v1/chats/group/:chatId/:participantId
 */
export const removeUserFromGroup = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, participantId } = req.params;

    //Check if chat is a group
    const groupChat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
      isGroupChat: true,
    });

    if (!groupChat) {
      throw new ApiError(404, "Group chat don't exist");
    }

    //Check if user who is adding is admin
    if (groupChat.admin?.toString() !== req.user?._id?.toString()) {
      throw new ApiError(404, "You are not an admin");
    }

    const existingParticipants = groupChat.participants;

    //check if the participants that is leaving the group, is part of the group
    if (!existingParticipants?.includes(participantId as never)) {
      throw new ApiError(400, "Participant does not exist in group chat");
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          participants: participantId, //remove participant to group
        },
      },
      { new: true }
    );

    const chat = await Chat.aggregate([
      {
        $match: {
          _id: updatedGroupChat?._id,
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
      throw new ApiError(500, "Internal server error");
    }

    // Emit leave chat event to the removed participant
    emitSocketEvent(
      req,
      participantId,
      ChatEventEnums.LEAVE_CHAT_EVENT,
      payload
    );

    return res
      .status(200)
      .json(new ApiResponse(200, payload, "Participant removed successfully"));
  }
);

/**
 * @description Delete One on One Chat
 * @route       DELETE /api/v1/chats/:chatId
 */
export const deleteOneOnOneChat = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;

    // Check for chat existence
    const chat = await Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(chatId),
        },
      },
      ...chatCommonAggregation(),
    ]);

    const payload = chat[0];

    if (!payload) {
      throw new ApiError(500, "Internal server error");
    }

    await Chat.findByIdAndDelete(chatId); // delete the chat

    const otherParticipant = payload?.participants?.find(
      (participant: any) =>
        participant?._id.toString() !== req.user?._id?.toString()
    );

    emitSocketEvent(
      req,
      otherParticipant._id.toString(),
      ChatEventEnums.LEAVE_CHAT_EVENT,
      payload
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Chat deleted successfully"));
  }
);
