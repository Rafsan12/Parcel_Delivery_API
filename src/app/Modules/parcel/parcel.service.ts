/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { calculatePrice } from "../../utils/calculatePrice";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.models";
import { Role } from "../User/user.interface";
import { User } from "../User/user.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createParcel = async (payload: Partial<IParcel>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Parcel.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
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

    // 🔑 Receiver email mandatory check
    if (!payload.customerEmail) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Receiver email (customerEmail) is required"
      );
    }

    const totalPrice = (payload.price = calculatePrice(
      payload.weight!,
      payload.deliveryArea!
    ));

    // payload.status = ParcelStatus.PENDING;

    const parcel = await Parcel.create(
      [
        {
          user: userId,
          status: ParcelStatus.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          parcel: parcel[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: totalPrice,
        },
      ],
      { session }
    );

    const updateParcel = await Parcel.findByIdAndUpdate(
      parcel[0]._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return updateParcel;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
