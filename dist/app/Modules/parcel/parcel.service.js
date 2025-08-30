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
exports.ParcelServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const calculatePrice_1 = require("../../utils/calculatePrice");
const payment_interface_1 = require("../payment/payment.interface");
const payment_models_1 = require("../payment/payment.models");
const SSLCommerz_service_1 = require("../SSLCommerz/SSLCommerz.service");
const user_interface_1 = require("../User/user.interface");
const user_model_1 = require("../User/user.model");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const createParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = getTransactionId();
    const session = yield parcel_model_1.Parcel.startSession();
    session.startTransaction();
    try {
        const senderUser = yield user_model_1.User.findById(payload.sender);
        if (!senderUser) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender user not found");
        }
        if (senderUser.role === user_interface_1.Role.RECEIVER) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receivers cannot create parcels");
        }
        if (!payload.customerEmail) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver email (customerEmail) is required");
        }
        const totalPrice = (payload.price = (0, calculatePrice_1.calculatePrice)(payload.weight, payload.deliveryArea));
        const parcel = yield parcel_model_1.Parcel.create([
            Object.assign({ sender: payload.sender, status: parcel_interface_1.ParcelStatus.PENDING }, payload),
        ], { session });
        const payment = yield payment_models_1.Payment.create([
            {
                parcel: parcel[0]._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: totalPrice,
            },
        ], { session });
        const updateParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcel[0]._id, {
            payment: payment[0]._id,
        }, { new: true, runValidators: true, session });
        const sslPayload = {
            address: payload.deliveryAddress,
            email: payload.customerEmail,
            phoneNumber: payload.customerPhone,
            name: payload.customerName,
            amount: totalPrice,
            transactionId: transactionId,
        };
        const sslPayment = yield SSLCommerz_service_1.SSLService.SSLPaymentInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentURL: sslPayment.GatewayPageURL,
            parcel: updateParcel,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateParcelStatus = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, status } = payload;
    if (!status) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Status is required to update the parcel");
    }
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Parcel not found");
    }
    parcel.status = status;
    yield parcel.save();
    return parcel;
});
const parcelTracking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackingId } = payload;
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId });
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Parcel not found");
    }
    return parcel;
});
exports.ParcelServices = {
    createParcel,
    parcelTracking,
    updateParcelStatus,
};
