"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../Modules/User/user.route");
const auth_route_1 = require("../Modules/auths/auth.route");
const parcel_route_1 = require("../Modules/parcel/parcel.route");
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
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
