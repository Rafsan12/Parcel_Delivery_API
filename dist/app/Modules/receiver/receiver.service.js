"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiverService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const parcel_interface_1 = require("../parcel/parcel.interface");
const parcel_model_1 = require("../parcel/parcel.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_models_1 = require("../payment/payment.models");
const receiverTotalParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerEmail } = payload;
    if (!customerEmail) {
        throw new Error("customerEmail is required");
    }
    //   console.log(customerEmail);
    const receiver = yield parcel_model_1.Parcel.find({ customerEmail });
    //   console.log(receiver);
    const totalParcels = receiver.length;
    const totalAmount = receiver.reduce((sum, p) => sum + (p.price || 0), 0);
    const statusCounts = receiver.reduce((acc, parcel) => {
        const status = parcel.status.toUpperCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
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
});
const parcelDelivered = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId).populate("payment");
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    const payment = yield payment_models_1.Payment.findById(parcel.payment);
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment record not found");
    }
    if (payment.status !== payment_interface_1.PAYMENT_STATUS.PAID) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Payment not completed for transactionId: ${payment.transactionId}`);
    }
    parcel.status = parcel_interface_1.ParcelStatus.DELIVERED;
    parcel.statusLog.push({
        status: parcel_interface_1.ParcelStatus.DELIVERED,
        changedAt: new Date(),
    });
    yield parcel.save();
});
exports.ReceiverService = {
    receiverTotalParcel,
    parcelDelivered,
};
