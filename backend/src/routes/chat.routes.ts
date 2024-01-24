import express from "express";
import {
  addUserToGroup,
  createGroupChat,
  createOrAccessChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
  leaveGroupChat,
  removeUserFromGroup,
  renameGroupChat
} from "../controllers/chat.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.use(isLoggedIn)

router
  .route('/')
  .get(getAllChats);

router
  .route('/:chatId')
  .delete(deleteOneOnOneChat);

router
  .route('/c/:receiverId')
  .post(createOrAccessChat);

router
  .route('/group')
  .post(createGroupChat);

router
  .route('/group/:chatId')
  .get(getGroupChatDetails)
  .patch(renameGroupChat)
  .delete(deleteGroupChat);

router
  .route('/group/:chatId/:participantId')
  .post(addUserToGroup)
  .delete(removeUserFromGroup);

router
  .route('/group/leave/:chatId')
  .delete(leaveGroupChat);

export default router;