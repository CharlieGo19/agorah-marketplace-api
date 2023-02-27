import { Router, Request, Response, NextFunction } from "express";
import { collections } from "@prisma/client";
import { GetCollection } from "../controllers/collection.controller";
import { PrismaToJSON } from "../utils/helper.functions";

const collectionRouter: Router = Router();

collectionRouter.get("/collection", async (req: Request, res: Response, next: NextFunction) => {
	// TODO: handle if collectionId isn't present. i.e. 404
	const collectionIdString: string[] = (req.query.collectionId as string).split(".");
	// Do sanity checks.
	try {
		const returnValue: collections | undefined = await GetCollection(
			BigInt(collectionIdString[2])
		);
		res.send(PrismaToJSON(returnValue));
	} catch (err) {
		next(err);
	}
});

export default collectionRouter;
