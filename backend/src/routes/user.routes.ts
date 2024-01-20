import express from "express";
import { allUsers } from "../controllers/user.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.use(isLoggedIn)

router.get("/", allUsers);

export default router;