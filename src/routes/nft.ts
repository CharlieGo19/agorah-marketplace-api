import { nft } from "@prisma/client";
import { Router, Request, Response, NextFunction } from "express";
import { GetNft } from "../controllers/nft.controller";

const nftRouter: Router = Router();

nftRouter.get("/nft", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const NFT: nft | undefined = (await GetNft(
			req.query.collectionId as string,
			req.query.serial as string
		)) as nft;
		res.status(200).json(NFT);
	} catch (err) {
		next(err);
	}
});

export default nftRouter;
