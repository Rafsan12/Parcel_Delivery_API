import { IParcel } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";

const getAllParcelCount = async (payload: Partial<IParcel>) => {
  const { sender } = payload;

  const parcels = await Parcel.find({ sender });

  const totalParcels = parcels.length;
  const totalAmount = parcels.reduce((sum, p) => sum + (p.price || 0), 0);

  const statusCounts = parcels.reduce((acc, parcel) => {
    const status = parcel.status.toUpperCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalParcels,
    totalAmount,
    statusCounts,
  };
};

export const SenderServices = {
  getAllParcelCount,
};
