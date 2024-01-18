import express from "express";
import { accessChat, addUserToGroup, createGroupChat, fetchAllChats, removeUserFromGroup, renameGroupChat } from "../controllers/chat.controllers";
import { isLoggedIn } from "../middlewares/users.middlewares";

const router = express.Router();

router.route('/')
        .post(isLoggedIn,accessChat)
        .get(fetchAllChats);

router.route('/group').post(isLoggedIn, createGroupChat);
router.route('/group/rename').post(isLoggedIn, renameGroupChat);
router.route('/group/add').put(isLoggedIn, addUserToGroup);
router.route('/group/remove').put(isLoggedIn, removeUserFromGroup);

export default router;