"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelStatusSchema = exports.createParcelSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.createParcelSchema = zod_1.z.object({
    customerName: zod_1.z
        .string({ message: "Customer name is required" })
        .min(2, { message: "Customer name must be at least 2 characters." }),
    customerEmail: zod_1.z.string().email("Must be a valid email"),
    customerPhone: zod_1.z
        .string({ message: "Customer phone is required" })
        .min(10, { message: "Phone must be at least 10 characters." }),
    deliveryAddress: zod_1.z.string({
        message: "Delivery address is required",
    }),
    deliveryArea: zod_1.z.enum(["INSIDE_DHAKA", "OUTSIDE_DHAKA"], {
        message: "Delivery area is required",
    }),
    weight: zod_1.z.number({ message: "Weight is required" }).positive(),
    price: zod_1.z.number().optional(),
    sender: zod_1.z
        .string({ message: "Sender ID is required" })
        .refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
        message: "Sender must be a valid ObjectId",
    }),
});
exports.updateParcelStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "PICKED", "ON_THE_WAY", "DELIVERED", "CANCELLED"], {
        message: "Status must be a valid enum value",
    }),
});
