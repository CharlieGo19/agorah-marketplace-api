import { Router, Request, Response, NextFunction } from "express";
import { collections } from "@prisma/client";
import { GetCollection } from "../controllers/collection.controller";

const collectionRouter: Router = Router();

collectionRouter.get("/collection", async (req: Request, res: Response, next: NextFunction) => {
	const collectionIdString: string[] = (req.query.collectionId as string).split(".");
	// TODO: if can not convert to big int, throw bad input & if len of above != 3.
	try {
		const returnValue: collections | undefined = await GetCollection(
			BigInt(collectionIdString[2])
		);

		res.status(200).send(returnValue);
	} catch (err) {
		next(err);
	}
});

export default collectionRouter;
