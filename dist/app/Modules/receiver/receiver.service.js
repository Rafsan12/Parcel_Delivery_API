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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiverService = void 0;
const parcel_model_1 = require("../parcel/parcel.model");
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
exports.ReceiverService = {
    receiverTotalParcel,
};
