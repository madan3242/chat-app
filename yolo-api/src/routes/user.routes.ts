import express from "express";
import { login } from "../controllers/user.controllers";

const router = express.Router();

router.post("/login", login);
router.post("/signup");

export default router;