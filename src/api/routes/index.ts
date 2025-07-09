import { Router } from "express";
import authRouter from "./authRoute";
const router = Router();

router.use('/auth', authRouter)

export default router;