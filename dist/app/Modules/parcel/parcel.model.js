"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const parcel_interface_1 = require("./parcel.interface");
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        required: true,
    },
    changedAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
// Tracking ID generator
const generateTrackingId = () => {
    return `TRK-${(0, uuid_1.v4)()}`;
};
const parcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true,
        default: generateTrackingId,
    },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryArea: {
        type: String,
        enum: Object.values(parcel_interface_1.DeliveryArea),
        required: true,
    },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.PENDING,
    },
    statusLog: {
        type: [statusLogSchema],
        default: [],
    },
}, {
    timestamps: true,
});
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
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
