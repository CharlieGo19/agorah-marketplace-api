import express, { Express } from "express";
import dotenv from "dotenv";
import Helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import { Env } from "./utils/startup";
import rootRouter from "./routes/root";
import collectionRouter from "./routes/collection";

dotenv.config();
// TODO:  Setup TLS certs.
// TODO: Secure sessions.
// https://expressjs.com/en/advanced/best-practice-security.html

export const env: Env = new Env();
export const prisma: PrismaClient = new PrismaClient(); // TODO: Configure logging.

const app: Express = express();
const port: string | undefined = process.env.PORT; // TODO: get from startup

app.use(Helmet());
app.disable("x-powered-by");

app.use("/", rootRouter);
app.use("/api/v0/", rootRouter);
app.use("/api/v0/", collectionRouter);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
