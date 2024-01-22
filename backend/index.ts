import app from "./src/app";
import dotenv from "dotenv";
import connectdb from "./src/config/database";
dotenv.config();

const PORT = process.env.PORT as string | 8000

app.listen(PORT , ()=>{
    connectdb();
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})