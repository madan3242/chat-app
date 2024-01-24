import Router from "express";
import userRouter from "./user.routes";
import chatRouter from "./chat.routes";
import messageRouter from "./message.routes";

const router = Router();

router.use("/", userRouter);
router.use("/chat", chatRouter);
router.use("/message", messageRouter);

export default router;