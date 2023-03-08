import { nft } from "@prisma/client";
import { Router, Request, Response, NextFunction } from "express";
import { GetNftPreviewsRange } from "../controllers/nfts.controller";
import { PrismaToJSON } from "../utils/helper.functions";

const nftsRouter: Router = Router();

nftsRouter.get("/nfts", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const nfts: nft[] = (await GetNftPreviewsRange(
			req.query.collectionId as string,
			req.query.nftSerialRangeFrom as string,
			req.query.nftSerialRangeTo as string
		)) as nft[];

		res.status(200).json(nfts);
	} catch (err) {
		next(err);
	}
});
export default nftsRouter;
