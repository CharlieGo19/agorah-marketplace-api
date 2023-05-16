import { Router, Request, Response, NextFunction } from "express";

const buyRouter: Router = Router();

buyRouter.get("/buy", async (req: Request, res: Response, next: NextFunction) => {
	const transactionBytesBase64String: string = req.query.transaction as string;
	const transactionBytes: Uint8Array = new Uint8Array(
		Array.from(Buffer.from(transactionBytesBase64String))
	);
});

export default buyRouter;
