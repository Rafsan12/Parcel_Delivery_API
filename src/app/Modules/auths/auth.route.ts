import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refreshToken", AuthController.getNewAccessToken);
router.post("/log-out", AuthController.logout);

export const AuthRouter = router;
