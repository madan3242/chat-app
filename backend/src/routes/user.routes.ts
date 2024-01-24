import express from "express";
import { allUsers } from "../controllers/user.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.get("/", isLoggedIn, allUsers);

export default router;