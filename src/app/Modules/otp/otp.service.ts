import crypto from "crypto";
import { redisClient } from "../../config/redis.config";

const OTP_EXPIRATION = 2 * 60;
const generateOtp = (length = 6) => {
  //6 digit otp
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp;
};

const sentOtp = async (email: string, name: string) => {
  const otp = generateOtp();

  const redisKe = `otp:${email}`;

  await redisClient.set(redisKe, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });
};
const verifyOtp = async () => {};

export const OtpService = {
  sentOtp,
  verifyOtp,
};
