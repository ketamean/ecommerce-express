import { Router, Request, Response } from "express";
import { refreshToken } from "@middlewares/auth";

const router = Router();

// Refresh token endpoint
router.post("/refresh-token", refreshToken);

export default router;
