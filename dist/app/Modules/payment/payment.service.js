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
exports.PaymentService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const parcel_interface_1 = require("../parcel/parcel.interface");
const parcel_model_1 = require("../parcel/parcel.model");
const payment_interface_1 = require("./payment.interface");
const payment_models_1 = require("./payment.models");
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        const updatePayment = yield payment_models_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { new: true, runValidators: true, session });
        if (!updatePayment)
            throw new AppError_1.default(401, "Payment not found");
        const updateParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(updatePayment.parcel, { status: parcel_interface_1.ParcelStatus.DELIVERED }, { new: true, runValidators: true, session }).populate("sender");
        if (!updateParcel)
            throw new AppError_1.default(401, "Parcel not found");
        // Prepare PDF data
        const invoiceData = {
            invoiceNumber: `INV-${updateParcel.trackingId}`,
            date: new Date().toLocaleDateString(),
            sender: {
                name: updateParcel.sender.name,
                email: updateParcel.sender.email,
                phone: updateParcel.sender.phone,
                address: updateParcel.sender.address,
            },
            receiver: {
                name: updateParcel.customerName,
                email: updateParcel.customerEmail,
                phone: updateParcel.customerPhone,
                address: updateParcel.deliveryAddress,
            },
            parcel: {
                trackingId: updateParcel.trackingId,
                weight: updateParcel.weight,
                deliveryArea: updateParcel.deliveryArea,
                price: updateParcel.price,
            },
            payment: {
                transactionId: updatePayment.transactionId,
                status: updatePayment.status,
            },
        };
        const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
        // Send invoice PDF via email
        yield (0, sendEmail_1.sendEmail)({
            to: updateParcel.customerEmail,
            subject: `Parcel Invoice - ${updateParcel.trackingId}`,
            templateName: "invoiceEmail",
            templateData: { name: updateParcel.customerName, invoiceData },
            attachments: [
                {
                    fileName: `invoice-${updateParcel.trackingId}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Completed Successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        const updatePayment = yield payment_models_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { new: true, runValidators: true, session });
        if (!updatePayment)
            throw new AppError_1.default(401, "Payment not found");
        const updateParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(updatePayment.parcel, { status: parcel_interface_1.ParcelStatus.PENDING }, { new: true, runValidators: true, session });
        if (!updateParcel)
            throw new AppError_1.default(401, "Parcel not found");
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment FAILED" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        const updatePayment = yield payment_models_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCELLED }, { new: true, runValidators: true, session });
        if (!updatePayment)
            throw new AppError_1.default(401, "Payment not found");
        const updateParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(updatePayment.parcel, { status: parcel_interface_1.ParcelStatus.CANCELLED }, { new: true, runValidators: true, session });
        if (!updateParcel)
            throw new AppError_1.default(401, "Parcel not found");
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Cancelled" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
};
