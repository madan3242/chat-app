import app from "./src/app";
import connectdb from "./src/database";
import { PORT } from "./src/config";
import dotenv from "dotenv";
dotenv.config();

app.listen(PORT , ()=>{
    connectdb();
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});