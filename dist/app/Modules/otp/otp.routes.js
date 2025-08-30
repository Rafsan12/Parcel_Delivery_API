"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRouter = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
const router = (0, express_1.Router)();
router.post("/sent-otp", otp_controller_1.OtpController.sentOtp);
router.post("/verify-otp", otp_controller_1.OtpController.verifyOtp);
exports.OtpRouter = router;
