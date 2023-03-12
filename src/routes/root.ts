import { Router, Request, Response } from "express";

const rootRouter: Router = Router();

rootRouter.get("/", (_req: Request, res: Response) => {
	res.send("What're you doing here?");
});

export default rootRouter;
