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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const calculatePrice_1 = require("../../utils/calculatePrice");
const user_interface_1 = require("../User/user.interface");
const user_model_1 = require("../User/user.model");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const createParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const senderUser = yield user_model_1.User.findById(payload.sender);
    if (!senderUser) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender user not found");
    }
    if (senderUser.role === user_interface_1.Role.RECEIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receivers cannot create parcels");
    }
    if (!payload.price) {
        payload.price = (0, calculatePrice_1.calculatePrice)(payload.weight, payload.deliveryArea);
    }
    payload.status = parcel_interface_1.ParcelStatus.PENDING;
    const parcel = yield parcel_model_1.Parcel.create(payload);
    return parcel;
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
