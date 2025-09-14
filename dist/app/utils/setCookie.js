"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const setAuthCookie = (res, tokenInfo) => {
    // const isProd = envVas.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    };
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, cookieOptions);
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, cookieOptions);
    }
};
exports.setAuthCookie = setAuthCookie;
