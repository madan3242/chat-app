import { Schema, model } from "mongoose";
import { IUser } from "../utils/types";

const userSchema = new Schema<IUser>({
        profilePicture: {
            type: {
            url: String,
            localPath: String,
            },
            default: {
                url: `https://via.placeholder.com/200x200.png`,
                localPath: "",
            }
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password required"]
        },
        role: {
            type: String,
            required: true,
            default: "user"
        }
    },
    { timestamps: true }
)

export const User = model("User", userSchema);