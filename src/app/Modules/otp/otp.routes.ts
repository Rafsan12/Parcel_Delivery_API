import { Router } from "express";
import { OtpController } from "./otp.controller";

const router = Router();

router.post("/sent-otp", OtpController.sentOtp);
router.post("/verify-otp", OtpController.verifyOtp);
export const OtpRouter = router;
