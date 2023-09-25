import express, { Request, Response } from "express"

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello from Server </h1>')
})

export default app;