import express from "express";
import { login, logout, signup } from "../controllers/user.controllers";
import { allUsers, searchAvailableUsers } from "../controllers/user.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);

router.get("/users", isLoggedIn, searchAvailableUsers);

export default router;