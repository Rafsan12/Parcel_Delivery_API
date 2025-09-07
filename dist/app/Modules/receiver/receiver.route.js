"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiverRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../User/user.interface");
const receiver_controller_1 = require("./receiver.controller");
const router = express_1.default.Router();
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), receiver_controller_1.ReceiverController.receiverTotalParcel);
router.patch("/:parcelId/delivered", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER, user_interface_1.Role.SUPER_ADMIN), receiver_controller_1.ReceiverController.parcelDelivered);
exports.ReceiverRoutes = router;
