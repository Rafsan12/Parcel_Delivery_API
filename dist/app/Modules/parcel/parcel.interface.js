"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelStatus = exports.DeliveryArea = void 0;
var DeliveryArea;
(function (DeliveryArea) {
    DeliveryArea["INSIDE_DHAKA"] = "INSIDE_DHAKA";
    DeliveryArea["OUTSIDE_DHAKA"] = "OUTSIDE_DHAKA";
})(DeliveryArea || (exports.DeliveryArea = DeliveryArea = {}));
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["PENDING"] = "PENDING";
    ParcelStatus["PICKED"] = "PICKED";
    ParcelStatus["DELIVERED"] = "DELIVERED";
    ParcelStatus["ON_THE_WAY"] = "ON_THE_WAY";
    ParcelStatus["READY_FOR_DISPATCH"] = "READY_FOR_DISPATCH";
    ParcelStatus["CANCELLED"] = "CANCELLED";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
