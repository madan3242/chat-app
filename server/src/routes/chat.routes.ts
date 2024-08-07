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
  renameGroupChat,
  searchAvailableUsers,
} from "../controllers/chat.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.use(isLoggedIn);

router.get("/users", searchAvailableUsers);

router.route("/").get(getAllChats);

router.route("/:chatId").delete(deleteOneOnOneChat);

router.route("/c/:receiverId").post(createOrAccessChat);

router.route("/group").post(createGroupChat);

router
  .route("/group/:chatId")
  .get(getGroupChatDetails)
  .patch(renameGroupChat)
  .delete(deleteGroupChat);
  
router.route("/group/leave/:chatId").delete(leaveGroupChat);

router
  .route("/group/:chatId/:participantId")
  .post(addUserToGroup)
  .delete(removeUserFromGroup);

export default router;
