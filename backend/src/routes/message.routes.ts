import express from "express";
import { allMessages, sendMessage } from "../controllers/message.controller";
import { verifyToken } from "../middlewares/usersMiddleware";

const router = express.Router();

router.route('/:chatId').post(allMessages);
router.route('/send').post( verifyToken,sendMessage);

export default router;