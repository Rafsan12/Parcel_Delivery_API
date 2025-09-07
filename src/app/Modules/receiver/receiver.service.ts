import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IParcel, ParcelStatus } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.models";

const receiverTotalParcel = async (payload: Partial<IParcel>) => {
  const { customerEmail } = payload;
  if (!customerEmail) {
    throw new Error("customerEmail is required");
  }
  //   console.log(customerEmail);
  const receiver = await Parcel.find({ customerEmail });
  //   console.log(receiver);
  const totalParcels = receiver.length;
  const totalAmount = receiver.reduce((sum, p) => sum + (p.price || 0), 0);

  const statusCounts = receiver.reduce((acc, parcel) => {
    const status = parcel.status.toUpperCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trackingData = receiver.map((r) => ({
    trackingId: r.trackingId,
    status: r.status,
  }));

  return {
    totalParcels,
    totalAmount,
    statusCounts,
    trackingData,
  };
};

const parcelDelivered = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId).populate("payment");
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  const payment = await Payment.findById(parcel.payment);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
  }
  if (payment.status !== PAYMENT_STATUS.PAID) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Payment not completed for transactionId: ${payment.transactionId}`
    );
  }

  parcel.status = ParcelStatus.DELIVERED;
  parcel.statusLog.push({
    status: ParcelStatus.DELIVERED,
    changedAt: new Date(),
  });
  await parcel.save();
};
export const ReceiverService = {
  receiverTotalParcel,
  parcelDelivered,
};
