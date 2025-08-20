import { IParcel } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";

const receiverTotalParcel = async (payload: Partial<IParcel>) => {
  const { customerEmail, trackingId } = payload;
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

export const ReceiverService = {
  receiverTotalParcel,
};
