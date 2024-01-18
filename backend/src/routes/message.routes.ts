import express from "express";
import { allMessages, sendMessage } from "../controllers/message.controllers";
import { isLoggedIn } from "../middlewares/users.middlewares";

const router = express.Router();

router.route('/:chatId').post(isLoggedIn, allMessages);
router.route('/send').post( isLoggedIn,sendMessage);

export default router;