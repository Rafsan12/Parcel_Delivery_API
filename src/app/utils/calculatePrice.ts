import { DeliveryArea } from "../Modules/parcel/parcel.interface";

export const calculatePrice = (weight: number, area: DeliveryArea): number => {
  const base = area === DeliveryArea.INSIDE_DHAKA ? 120 : 250;
  const perKG = 10;
  const result = base + weight * perKG;
  return result;
};
