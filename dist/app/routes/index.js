"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../Modules/User/user.route");
const auth_route_1 = require("../Modules/auths/auth.route");
const otp_routes_1 = require("../Modules/otp/otp.routes");
const parcel_route_1 = require("../Modules/parcel/parcel.route");
const payment_routes_1 = require("../Modules/payment/payment.routes");
const receiver_route_1 = require("../Modules/receiver/receiver.route");
const sender_route_1 = require("../Modules/sender/sender.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRouter,
    },
    {
        path: "/parcel",
        route: parcel_route_1.ParcelRouter,
    },
    {
        path: "/sender",
        route: sender_route_1.SenderRouter,
    },
    {
        path: "/receiver",
        route: receiver_route_1.ReceiverRoutes,
    },
    {
        path: "/payment",
        route: payment_routes_1.PaymentRouter,
    },
    {
        path: "/otp",
        route: otp_routes_1.OtpRouter,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
