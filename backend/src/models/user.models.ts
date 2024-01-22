import { Schema, model } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema<IUser>({
    profilePicture: {
        type: String,
        required: true,
        default: `https://via.placeholder.com/200x200.png`,
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
        default: "user",
    }
}, { timestamps: true });

const User = model("User", userSchema);

export default User;