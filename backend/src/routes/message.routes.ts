import express from "express";
import { allMessages, sendMessage } from "../controllers/message.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.use(isLoggedIn)

router.route('/:chatId').post(allMessages);
router.route('/send').post(sendMessage);

export default router;