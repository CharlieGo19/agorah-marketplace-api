import { Router, Request, Response, NextFunction } from "express";
import { ListNftForSale } from "../controllers/sell.controller";

const sellRouter: Router = Router();

sellRouter.get("/sell", async (req: Request, res: Response, next: NextFunction) => {
	const transactionBytesBase64String: string = req.query.transaction as string;
	let transactionBytes: Uint8Array | undefined;
	try {
		const transactionBytes: Uint8Array = new Uint8Array(
			Array.from(Buffer.from(transactionBytesBase64String))
		);
	} catch (err) {
		console.log("Conversion Error, bad transaction - return resp.");
		return;
	}

	ListNftForSale(transactionBytes as Uint8Array);
});

export default sellRouter;
