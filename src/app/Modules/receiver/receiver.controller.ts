import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReceiverService } from "./receiver.service";

const receiverTotalParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await ReceiverService.receiverTotalParcel(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Receiver analytics fetched successfully",
    data: result,
  });
});

export const ReceiverController = {
  receiverTotalParcel,
};
