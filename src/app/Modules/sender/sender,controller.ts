/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SenderServices } from "./sender.service";

const getAllParcelCount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await SenderServices.getAllParcelCount(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel analytics fetched successfully",
      data: result,
    });
  }
);

export const SenderControllers = {
  getAllParcelCount,
};
