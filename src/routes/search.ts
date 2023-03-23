import { Router, Request, Response, NextFunction } from "express";
import { SearchAgorah } from "../controllers/search.controller";

const searchRouter: Router = Router();

searchRouter.get("/search", async (req: Request, res: Response, next: NextFunction) => {
	const result: any = await SearchAgorah(req.query.value as string);
	res.status(200).json(result);
});
export default searchRouter;
