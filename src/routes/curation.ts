import { Router, Request, Response, NextFunction } from "express";
import { GetCuration } from "../controllers/curation.controller";

const userCurationRouter: Router = Router();

userCurationRouter.get("/curation", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accountInput: string = req.query.accountId as string;
		const returnValue = await GetCuration(accountInput);
		res.status(200).json(returnValue);
	} catch (err) {
		next(err);
	}
});

export default userCurationRouter;
