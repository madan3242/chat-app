import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { handleError, notFoundError } from "./middlewares/errors.middlewares";
import router from "./routes";
// import helmet from "helmet";
import { initilizeSocketIO } from "./socket";

const app = express();

const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true
}));
app.use(morgan("dev"));
app.use(cookieParser());
// app.use(helmet());

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:4000"
  }
});

app.set("io", io);
initilizeSocketIO(io);

/**
 * Routes
 */
app.use("/api/v1", router);

/**
 * Error middleware
 */
app.use(handleError);
app.use(notFoundError);

export default httpServer;