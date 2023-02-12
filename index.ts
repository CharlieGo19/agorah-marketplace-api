import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Helmet from "helmet";

dotenv.config();
// TODO:  Setup TLS certs.
// TODO: Secure sessions.
// https://expressjs.com/en/advanced/best-practice-security.html

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use(Helmet());
app.disable("x-powered-by");

app.get("/", (_req: Request, res: Response) => {
	res.send("Agorah, the newest MArketplace on Hedera.");
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
