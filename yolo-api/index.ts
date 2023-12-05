import app from "./src/app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT as string | 8080

app.listen(PORT , ()=>{
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})