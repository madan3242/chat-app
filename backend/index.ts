import app from "./src/app";
import dotenv from "dotenv";
import connectdb from "./src/database";
import { PORT } from "./src/config";
dotenv.config();

app.listen(PORT , ()=>{
    connectdb();
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})