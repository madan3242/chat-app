import express from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/message.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";
import { upload } from "../middlewares/multer.middlewares";

const router = express.Router();

router.use(isLoggedIn);

router.route("/:chatId")
  .get(getAllMessages)
  .post(
    upload.fields([{ name: "attachments", maxCount: 5}]),
    sendMessage
  );

  router
    .route("/:chatId/:messageId")
    .delete(deleteMessage);

export default router;
