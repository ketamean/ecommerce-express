import { Router, Request, Response } from "express";

const router = Router();

router.get('/test', (req: Request, res: Response) => {
  throw new Error('Test error');
})

export default router;