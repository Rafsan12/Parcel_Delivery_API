/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const logInfo = await AuthService.credentialsLogin(req.body);
    setAuthCookie(res, logInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: logInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received from cookies"
      );
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: tokenInfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const decodedToken = req.user;

  await AuthService.resetPassword(req.body,decodedToken as JwtPayload);

  sendResponse(res,{
    success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
  });

})

const changePassword = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await AuthService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

  sendResponse(res,{
    success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
  });

})

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  changePassword,
};
