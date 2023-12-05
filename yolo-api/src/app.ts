import express, { Request, Response } from "express"
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log(socket);
});

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Yolo - Chat App</h1>')
})

export default httpServer;