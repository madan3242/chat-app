import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { User } from "../models";
import jwt from "jsonwebtoken";
import { COOKIE_TIME, JWT_EXPIRY, JWT_SECRET } from "../config";
import bcrypt from 'bcrypt';
import { IUser } from "../interfaces";
import ErrorHandler from "../utils/ErrorHandler";

/**
 * @description Register a new User
 * @route       POST /api/v1/auth/signup
 */
export const signup = AsyncHandler(async (req: Request, res: Response, next: NextFunction)  => {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return next(new ErrorHandler(400, "Username, Email Or Password is Required"));
    }

    const isExisting = await User.findOne({ email });

    if (isExisting) {
      return next(new ErrorHandler(400, "User already exists, Please Login"));
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, genSalt);

    const user: IUser = await User.create({
      username,
      email,
      password: hashPassword
    });

    const token = jwt.sign({
      id: user._id,
      email: user.email
    }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    const options = {
      expires: new Date(
        Date.now() + COOKIE_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
});

/**
 * @description Login User
 * @route       POST /api/v1/auth/login
 */
export const login = AsyncHandler(async (req: Request, res: Response, next: NextFunction)  => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new ErrorHandler(400, "Email and Password required"));
    }

    const user: IUser = await User.findOne({ username }).select("+password");

    if (!user) {
      return next(new ErrorHandler(400, "User don't exist, Please signup"));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password as string);

    if (!isPasswordMatch) {
      return next(new ErrorHandler(400, "Email and Password don't match."));
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email
    }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    const options = {
      expires: new Date(
        Date.now() + COOKIE_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
});

/**
 * @description Logout
 * @route       GET /api/v1/auth/logout
 */
export const logout = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return res.cookie("token", null, {expires: new Date(Date.now())}).json({
    success: true,
    token: null,
    user: null
  })
})

/**
 * @description Get All Users
 * @route       GET /api/v1/users
 */
export const allUsers = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find()

  const filter = users.map((user: IUser) => {
    return {
      id: user._id,
      username: user.username
    }
  })
  res.status(200).json(filter);
})