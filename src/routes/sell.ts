import { Router, Request, Response, NextFunction } from "express";
import { ListNftForSale } from "../controllers/sell.controller";

const sellRouter: Router = Router();

sellRouter.get("/sell", async (req: Request, res: Response, next: NextFunction) => {
	const transactionBytesBase64String: string = req.query.transaction as string;
	console.log(transactionBytesBase64String);
	let transactionBytes: Uint8Array | undefined;
	try {
		const transactionBytes: Uint8Array = new Uint8Array(
			Array.from(Buffer.from(transactionBytesBase64String))
		);
		await ListNftForSale(transactionBytes as Uint8Array);
		res.status(200).send("Transaction successful!");
	} catch (err) {
		next(err);
	}
});

export default sellRouter;
