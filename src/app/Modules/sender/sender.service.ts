import { Parcel } from "../parcel/parcel.model";

const getAllParcelCount = async (userId: string) => {
  const parcels = await Parcel.find({ sender: userId }).populate("payment");

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
