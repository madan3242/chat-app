import express from "express";
import { allUsers, login, logout, signup } from "../controllers/user.controllers";
import { verifyToken } from "../middlewares/usersMiddleware";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);

router.get("/users", verifyToken,allUsers);

export default router;