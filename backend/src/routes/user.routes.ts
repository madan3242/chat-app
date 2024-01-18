import express from "express";
import { allUsers, login, logout, signup } from "../controllers/user.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);

router.get("/users", isLoggedIn,allUsers);

export default router;