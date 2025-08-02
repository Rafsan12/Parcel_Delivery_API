import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelServices } from "./parcel.service";

const createParcel = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const parcel = await ParcelServices.createParcel(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel created successfully",
      data: parcel,
    });
  }
);

// Update Parcel Status Api
const updateParcelStatus = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    const parcel = await ParcelServices.updateParcelStatus({ id, status });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel status updated successfully",
      data: parcel,
    });
  }
);

// Tracking Parcel APi
const parcelTracking = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const parcel = await ParcelServices.parcelTracking(req.params);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "You Parcel Tracking number receive",
      data: parcel,
    });
  }
);

export const ParcelController = {
  createParcel,
  parcelTracking,
  updateParcelStatus,
};
