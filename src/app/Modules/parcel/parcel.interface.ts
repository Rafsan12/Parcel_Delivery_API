import { Types } from "mongoose";

export enum DeliveryArea {
  INSIDE_DHAKA = "INSIDE_DHAKA",
  OUTSIDE_DHAKA = "OUTSIDE_DHAKA",
}
export enum ParcelStatus {
  PENDING = "PENDING",
  PICKED = "PICKED",
  DELIVERED = "DELIVERED",
  ON_THE_WAY = "ON_THE_WAY",
  CANCELLED = "CANCELLED",
}

export interface IStatusLogEntry {
  status: ParcelStatus;
  changedAt: Date;
}

export interface IParcel {
  trackingId: string;
  sender: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryArea: DeliveryArea;
  weight: number;
  price: number;
  status: ParcelStatus;
  statusLog: IStatusLogEntry[];
}
