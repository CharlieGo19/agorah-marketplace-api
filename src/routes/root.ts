import { Router, Request, Response } from "express";

const rootRouter: Router = Router();

rootRouter.get("/", (_req: Request, res: Response) => {
	res.send("Return data for homepage carousels, notifications etc.");
});

export default rootRouter;
