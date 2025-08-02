import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVas } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "./../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies?.accessToken;
      if (!accessToken) {
        throw new AppError(httpStatus.FORBIDDEN, "No Token Received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVas.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted to view this route!!!"
        );
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
