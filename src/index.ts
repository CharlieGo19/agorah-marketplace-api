import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import Helmet from "helmet";
import compression from "compression";
import { PrismaClient } from "@prisma/client";
import { Env } from "./utils/startup";
import rootRouter from "./routes/root";
import collectionRouter from "./routes/collection";
import { errorHandler, MirrorNodeError } from "./utils/error.handler";
import nftsRouter from "./routes/nfts";

dotenv.config();
// TODO: Setup TLS certs.
// TODO: Secure sessions.
// https://expressjs.com/en/advanced/best-practice-security.html

export const env: Env = new Env();
export const prisma: PrismaClient = new PrismaClient(); // TODO: Configure logging.

const app: Express = express();
const port: string | undefined = env.GetExpressApiPort();

// The BigInt fix below is to allow us to send prisma JSON objects via res.json();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
	return this.toString();
};

app.use(cors());
app.use(Helmet());
app.use(compression());
app.disable("x-powered-by");

app.use("/", rootRouter);
app.use("/api/v0/", rootRouter);
app.use("/api/v0/", collectionRouter);
app.use("/api/v0/", nftsRouter);

app.use((err: Error | MirrorNodeError, req: Request, res: Response, next: NextFunction) => {
	errorHandler(err, req, res, next);
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
