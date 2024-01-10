import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT as string | 8000;


export {
    PORT 
}