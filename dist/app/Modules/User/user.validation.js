"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateZodSchema = exports.createZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Name must be a string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string({ message: "Email must be a string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string({ message: "Password must be a string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).+$/, {
        message: "Password must contain at least 1 uppercase letter, 1 number, and 1 special character.",
    }),
});
exports.updateZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Name must be a string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    email: zod_1.default
        .string({ message: "Email must be a string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." })
        .optional(),
    password: zod_1.default
        .string({ message: "Password must be a string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).+$/, {
        message: "Password must contain at least 1 uppercase letter, 1 number, and 1 special character.",
    })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default
        .enum([user_interface_1.IsActive.ACTIVE, user_interface_1.IsActive.INACTIVE, user_interface_1.IsActive.BLOCKED], {
        message: "Invalid isActive status.",
    })
        .optional(),
});
