/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { generatePdf } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { ParcelStatus } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { IUser } from "../User/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.models";

const successPayment = async (query: Record<string, string>) => {
  const session = await Parcel.startSession();
  session.startTransaction();

  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );
    if (!updatePayment) throw new AppError(401, "Payment not found");

    const updateParcel = await Parcel.findByIdAndUpdate(
      updatePayment.parcel,
      { status: ParcelStatus.DELIVERED },
      { new: true, runValidators: true, session }
    ).populate<{ sender: IUser }>("sender");

    if (!updateParcel) throw new AppError(401, "Parcel not found");
    // Prepare PDF data
    const invoiceData = {
      invoiceNumber: `INV-${updateParcel.trackingId}`,
      date: new Date().toLocaleDateString(),
      sender: {
        name: updateParcel.sender.name,
        email: updateParcel.sender.email,
        phone: updateParcel.sender.phone!,
        address: updateParcel.sender.address!,
      },
      receiver: {
        name: updateParcel.customerName,
        email: updateParcel.customerEmail,
        phone: updateParcel.customerPhone,
        address: updateParcel.deliveryAddress,
      },
      parcel: {
        trackingId: updateParcel.trackingId,
        weight: updateParcel.weight,
        deliveryArea: updateParcel.deliveryArea,
        price: updateParcel.price,
      },
      payment: {
        transactionId: updatePayment.transactionId,
        status: updatePayment.status,
      },
    };
    const pdfBuffer = await generatePdf(invoiceData);

    // Send invoice PDF via email
    await sendEmail({
      to: updateParcel.customerEmail,
      subject: `Parcel Invoice - ${updateParcel.trackingId}`,
      templateName: "invoiceEmail",
      templateData: { name: updateParcel.customerName, invoiceData },
      attachments: [
        {
          fileName: `invoice-${updateParcel.trackingId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const failPayment = async (query: Record<string, string>) => {
  const session = await Parcel.startSession();
  session.startTransaction();

  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );
    if (!updatePayment) throw new AppError(401, "Payment not found");

    const updateParcel = await Parcel.findByIdAndUpdate(
      updatePayment.parcel,
      { status: ParcelStatus.PENDING },
      { new: true, runValidators: true, session }
    );

    if (!updateParcel) throw new AppError(401, "Parcel not found");
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment FAILED" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Parcel.startSession();
  session.startTransaction();

  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { new: true, runValidators: true, session }
    );
    if (!updatePayment) throw new AppError(401, "Payment not found");

    const updateParcel = await Parcel.findByIdAndUpdate(
      updatePayment.parcel,
      { status: ParcelStatus.CANCELLED },
      { new: true, runValidators: true, session }
    );

    if (!updateParcel) throw new AppError(401, "Parcel not found");
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};
