import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routes";
import { initilizeSocketIO } from "./socket";
import { handleError, notFoundError } from "./middlewares/errors.middlewares";

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
app.use(helmet());

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