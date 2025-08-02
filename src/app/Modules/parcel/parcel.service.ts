import httpStatus from "http-status-codes";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { calculatePrice } from "../../utils/calculatePrice";
import { Role } from "../User/user.interface";
import { User } from "../User/user.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const createParcel = async (payload: Partial<IParcel>) => {
  const senderUser = await User.findById(payload.sender);
  if (!senderUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Sender user not found");
  }

  if (senderUser.role === Role.RECEIVER) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Receivers cannot create parcels"
    );
  }

  if (!payload.price) {
    payload.price = calculatePrice(payload.weight!, payload.deliveryArea!);
  }
  payload.status = ParcelStatus.PENDING;

  const parcel = await Parcel.create(payload);

  return parcel;
};

const updateParcelStatus = async (
  payload: Partial<IParcel> & { id: string }
) => {
  const { id, status } = payload;

  if (!status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Status is required to update the parcel"
    );
  }
  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(httpStatus.FORBIDDEN, "Parcel not found");
  }

  parcel.status = status;

  await parcel.save();

  return parcel;
};

const parcelTracking = async (payload: Partial<IParcel>) => {
  const { trackingId } = payload;
  const parcel = await Parcel.findOne({ trackingId });

  if (!parcel) {
    throw new AppError(httpStatus.FORBIDDEN, "Parcel not found");
  }
  return parcel;
};

export const ParcelServices = {
  createParcel,
  parcelTracking,
  updateParcelStatus,
};
