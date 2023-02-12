import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Helmet from "helmet";

dotenv.config();
// TODO:  Setup TLS certs.

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use(Helmet());

app.get("/", (_req: Request, res: Response) => {
	res.send("Agorah, the newest MArketplace on Hedera.");
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
