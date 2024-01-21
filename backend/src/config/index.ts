import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT as string | 8000;
export const COOKIE_TIME = parseInt(process.env.COOKIE_TIME as string);
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY as string);

// export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
// export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
// export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;