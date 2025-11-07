import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.get('/status', (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "API is online!" });
});

export { router };
