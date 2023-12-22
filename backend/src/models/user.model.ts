import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
            required: true
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        id: this._id,
        email: this.email
    }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRY});
}

export const user = mongoose.model("User", userSchema);