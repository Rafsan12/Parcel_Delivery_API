"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrice = void 0;
const parcel_interface_1 = require("../Modules/parcel/parcel.interface");
const calculatePrice = (weight, area) => {
    const base = area === parcel_interface_1.DeliveryArea.INSIDE_DHAKA ? 120 : 250;
    const perKG = 10;
    const result = base + weight * perKG;
    return result;
};
exports.calculatePrice = calculatePrice;
