import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OtpService } from "./otp.service";

const sentOtp = catchAsync(async (req: Request, res: Response) => {
  await OtpService.sentOtp();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully",
    data: null,
  });
});
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  await OtpService.verifyOtp();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP Verify successfully",
    data: null,
  });
});

export const OtpController = {
  sentOtp,
  verifyOtp,
};
