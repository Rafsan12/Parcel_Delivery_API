import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { DeliveryArea, IParcel, ParcelStatus } from "./parcel.interface";

const statusLogSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Tracking ID generator
const generateTrackingId = (): string => {
  return `TRK-${uuidv4()}`;
};

const parcelSchema = new Schema<IParcel>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      default: generateTrackingId,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryArea: {
      type: String,
      enum: Object.values(DeliveryArea),
      required: true,
    },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.PENDING,
    },
    statusLog: {
      type: [statusLogSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook
parcelSchema.pre("save", function (next) {
  if (!this.isNew && this.isModified("status")) {
    this.statusLog.push({
      status: this.status,
      changedAt: new Date(),
    });
  }

  if (this.isNew) {
    this.statusLog = [
      {
        status: this.status,
        changedAt: new Date(),
      },
    ];
  }

  next();
});

export const Parcel = model<IParcel>("Parcel", parcelSchema);
