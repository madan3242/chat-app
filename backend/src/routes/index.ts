import Router from "express";
import userRouter from "./user.routes";
import chatRouter from "./chat.routes";
import messageRouter from "./message.routes";

const router = Router();

router.use("/", userRouter);
router.use("/chats", chatRouter);
router.use("/messages", messageRouter);

export default router;