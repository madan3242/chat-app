import express from "express";
import {  
    getAllMessages, 
    sendMessage 
} from "../controllers/message.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.use(isLoggedIn);

router
    .route("/:chatId")
    .get(sendMessage)
    .post(getAllMessages);

export default router;