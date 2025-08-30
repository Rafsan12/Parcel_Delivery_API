import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refreshToken", AuthController.getNewAccessToken);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthController.resetPassword
);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthController.changePassword
);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/log-out", AuthController.logout);

export const AuthRouter = router;
