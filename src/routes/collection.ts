import { Router, Request, Response, NextFunction } from "express";

const collectionRouter: Router = Router();

collectionRouter.get("/collection", (req: Request, res: Response, _next: NextFunction) => {
	res.send(`Collection Data. ${req.query.collectionId}`);
});

export default collectionRouter;
