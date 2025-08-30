"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    parcel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Parcel",
        required: true,
        unique: true,
    },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paymentGateway: mongoose_1.Schema.Types.Mixed,
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PAYMENT_STATUS),
        default: payment_interface_1.PAYMENT_STATUS.UNPAID,
    },
}, {
    timestamps: true,
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
