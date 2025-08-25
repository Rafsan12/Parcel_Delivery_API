import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refreshToken", AuthController.getNewAccessToken);
router.post("/log-out", AuthController.logout);
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword);
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword);

export const AuthRouter = router;
